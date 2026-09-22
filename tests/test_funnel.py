import importlib.util
import datetime
import unittest
spec=importlib.util.spec_from_file_location('funnel','private/funnel.py')
funnel=importlib.util.module_from_spec(spec)
spec.loader.exec_module(funnel)

class FunnelTest(unittest.TestCase):
    def test_excludes_whole_internal_session_and_counts_unique_reach(self):
        def event(s, **props):
            return {'session_id':s,'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'event_name':'utility_feedback_detail','properties':props}
        rows=[event('staff',funnel_stage='01_entry'),event('staff',traffic_class='internal'),event('bot',traffic_class='suspected_bot'),event('reader',funnel_stage='03_recommendation'),event('reader',funnel_stage='03_recommendation'),event('reader',feedback_version=2,outcome='worked',tool='Claude',reason='none')]
        data=funnel.summarize(rows)
        self.assertEqual(data['sessions'],1)
        self.assertEqual(data['excluded_events'],3)
        self.assertEqual(data['stages']['03_recommendation'],1)
        self.assertEqual(data['outcomes'],{'worked':1})
        self.assertEqual(data['issues'],{})
    def test_escapes_untrusted_labels(self):
        page=funnel.render({'outcomes':{'<script>':1},'stages':{},'actions':{},'issues':{},'tools':{}},30)
        self.assertNotIn('<script>',page)
        self.assertIn('&lt;script&gt;',page)

if __name__=='__main__': unittest.main()
