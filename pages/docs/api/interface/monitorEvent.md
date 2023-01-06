# monitorEvent 

The `monitorEvent ` function is part of an advanced event monitoring system. These events will get logged as counters and logs(if full logging is on), but they will also be aggregated across all nodes by the monitor server/client. It takes in 4 parameters:

-`category` - the category of the event
-`name` - the name of the event
-`count` - specifies how many times we should increment the counter that is used for stats
-`message` - for extra details so more debugging clues can be given