# Debugging

This section explains the debugging process for applications built using shardus. This will likely be the most difficult part of the development process, so we recommend that you follow the instructions in this section when you come across errors or bugs in your application.

---

- [Application](./application) - Bugs related to your application code
- [State](./state) - Bugs related to your data synchronization
- [Transaction](./transaction) - Bugs related to transactions
- [Common](./common-errors) - Errors we have come across during development

---

> TODO (Thoughts)

- Need a section on setting up and using the debugger with shardus in a way that allows you to attach debuggers to every single instance of your network.

- Need a section on log forensics and how to use the logs to find bugs.

- Need a section on using pm2 tools and monitoring solutions to help catch cpu or memory related problems, including the v8 profiler and flame graphs.
