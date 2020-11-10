# Week 10

 

## 1. Meeting maps

![if1](./if1.png)

- What will the visualization look like? Will it be interactive? If so, how?

The interface starts with a map, where the user can click onto a zone. Then, the list of meetings pops up, with options for users to filter.

- How will the data need to be mapped to the visual elements?

The data is mapped mainly by filtering out the options selected by the users.

- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or  something else? How will this be done?

The filtering will be required, and it is likely sorted by the meeting time. This can be done in Javascript.

- What is the default view (if any)?

The default view is the clean simplistic map.

- What assumptions are made about the user?

The users are expected to use the web browser on the computer (not mobile).



## 2. Process blog

![if2](./if2.png)

- What will the visualization look like? Will it be interactive? If so, how?

The page starts with all posts, and when users clicks on certain topics, the list of posts is reduced to be only the ones filtered within the topic. It will be shown as a reverse chronological order.

- How will the data need to be mapped to the visual elements?

The data is mapped with NOSQL database, with primary key as their topics.

- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or  something else? How will this be done?

The filtering is necessary, for selecting by topics.

- What is the default view (if any)?

The default view is all the posts (in all topics).

- What assumptions are made about the user?

The users can view it both on the web and the mobile ends.





## 3. Sensor interface

![if3](./if3.png)

- What will the visualization look like? Will it be interactive? If so, how?

The visualization will be mainly a line plot, but in different temporal scales. The users can interact by selecting their variables of interest, as well as the temporal resolution.

- How will the data need to be mapped to the visual elements?

The data is mapped via the line plots.

- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or  something else? How will this be done?

There are aggregation involved, as the users can select to view by weekdays, which would mean each value is an average over all periodic weekdays (say, average of all Mondays).

- What is the default view (if any)?

The default view will be the "span" view, with all the temperature values shown on the plot (from the start to present).

- What assumptions are made about the user?

The users is expected to view it on the computer, which should look better than mobile end.




