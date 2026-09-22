"""Build a private aggregate dashboard from an events JSON export. Standard library only."""
import argparse
import collections
import datetime
import html
import json
import os
import pathlib
import urllib.parse
import urllib.request

STAGES = ['01_entry', '02_intent', '03_recommendation', '04_action', '05_verification', '06_conversion']

def summarize(events, days=30):
    cutoff = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days)
    rows = []
    for e in events:
        try:
            date = datetime.datetime.fromisoformat(e['created_at'].replace('Z', '+00:00'))
            if date.tzinfo is None: date = date.replace(tzinfo=datetime.timezone.utc)
            if date >= cutoff: rows.append(e)
        except (KeyError, ValueError, TypeError): continue
    excluded_ids = {e.get('session_id') for e in rows if (e.get('properties') or {}).get('traffic_class') in ['internal', 'suspected_bot'] and e.get('session_id')}
    clean = [e for e in rows if e.get('session_id') not in excluded_ids and (e.get('properties') or {}).get('traffic_class') not in ['internal','suspected_bot']]
    sessions = {e['session_id'] for e in clean if e.get('session_id')}
    stages = {s: set() for s in STAGES}
    actions, outcomes, issues, tools = (collections.Counter() for _ in range(4))
    for e in clean:
        p = e.get('properties') or {}
        stage = p.get('funnel_stage')
        if stage in stages and e.get('session_id'): stages[stage].add(e['session_id'])
        if stage == '06_conversion': actions[e.get('event_name', 'unknown')] += 1
        if e.get('event_name') == 'utility_feedback_detail' and p.get('feedback_version') == 2:
            outcomes[p.get('outcome', 'unknown')] += 1
            tools[p.get('tool', 'unspecified')] += 1
            if p.get('reason') not in [None, 'none']: issues[p['reason']] += 1
    return {'sessions':len(sessions), 'excluded_events':len(rows)-len(clean), 'missing_session_events':sum(not e.get('session_id') for e in clean), 'unclassified_events':sum((e.get('properties') or {}).get('traffic_class') in [None,'unclassified'] for e in clean), 'stages':{s:len(v) for s,v in stages.items()}, 'actions':dict(actions),'outcomes':dict(outcomes),'issues':dict(issues),'tools':dict(tools)}

def render(data, days):
    def table(title, values):
        return '<h2>'+html.escape(title)+'</h2><table><tr><th>Metric</th><th>Count</th></tr>'+''.join('<tr><td>'+html.escape(str(k))+'</td><td>'+str(v)+'</td></tr>' for k,v in values.items())+'</table>'
    result = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DiscoverAINow private funnel</title><style>body{font:16px/1.6 system-ui;max-width:960px;margin:40px auto;padding:20px;color:#172034;background:#f7f8fc}table{border-collapse:collapse;width:100%;background:white}td,th{padding:10px;border:1px solid #ccd2dc;text-align:left}h2{margin-top:32px}</style><h1>DiscoverAINow private funnel</h1>'
    result += f'<p>Last {days} days · Generated {datetime.datetime.now(datetime.timezone.utc).isoformat()}</p><p>Stage reach counts unique sessions independently, not a sequential conversion rate. Conversion events below are engagement or leads, not revenue. Bot filtering is heuristic; historical and unclassified events may include automation. No raw task text is shown.</p>'
    result += table('Traffic', {k:v for k,v in data.items() if isinstance(v,int)})
    for key in ['stages','actions','outcomes','issues','tools']: result += table(key.title(), data[key])
    return result+'</html>'

def fetch_live(days):
    url = os.environ.get('SUPABASE_URL', '').rstrip('/')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
    if not url.startswith('https://') or not key: raise ValueError('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment.')
    cutoff = (datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=days)).isoformat()
    rows, offset = [], 0
    while True:
        query = urllib.parse.urlencode({'select':'event_name,path,session_id,properties,created_at','created_at':'gte.'+cutoff,'order':'id.asc','limit':1000,'offset':offset})
        request = urllib.request.Request(url+'/rest/v1/events?'+query, headers={'apikey':key,'Authorization':'Bearer '+key})
        with urllib.request.urlopen(request, timeout=30) as response: batch = json.load(response)
        rows.extend(batch)
        if not batch: return rows
        offset += len(batch)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument('--input', type=pathlib.Path)
    source.add_argument('--live', action='store_true')
    parser.add_argument('--days',type=int,default=30)
    parser.add_argument('--output',type=pathlib.Path,default=pathlib.Path(__file__).with_name('funnel.html'))
    args = parser.parse_args()
    if args.days < 1: parser.error('--days must be positive')
    try:
        events = fetch_live(args.days) if args.live else json.loads(args.input.read_text())
        if not isinstance(events,list): raise ValueError('Expected a JSON array of events.')
        args.output.write_text(render(summarize(events,args.days),args.days))
        args.output.chmod(0o600)
        print('Private report saved to '+str(args.output))
    except Exception as error:
        parser.exit(1,'Report could not be generated ('+type(error).__name__+'). Check the input or local credentials.\n')

if __name__ == '__main__': main()
