## TODO FINISH WITH MVP

- Make style consistent on backend
- Make everything responsive
- Do the events page styling
- Make recurring events work..........

### Frontend Changes

- Add event/sermon pages that display the data
  - Each event has a carousel (like [my website](https://www.natewbrooks.com)) at the bottom under the information to view all images/videos
- Make Recurring Events work on [Calendar](frontend/src/pages/Calendar.jsx)
- RESPONSIVE MOBILE!!
- Add responsive navigation on admin panel
- Bug where saving date times when one is cancelled overrides and neither shows up

### Admin Panel Changes

- Make "Recurring Events" flag toggle the "WEEKDAY SELECT" component.
  - Save the weekdays selected as the days of the current week. Frontend will know to distinguish based on "IsRecurring" flag
- <s>Add JWT login authentication when hitting the /admin/ endpoint</s>
- <s>Make sure to encrypt passwords of usernames with [bcrypt](https://www.npmjs.com/package/bcrypt)</s>
- <s>Make events have their own images (+ videos?) associated with them</s>
- <s>Make events cancellable</s>
- <s>Add sermon data type -- should be a sort of "clone" with slight changes from events data types</s>
- <s>JoinUs "Sermon Image URL" needs to be updated to be in the same format as the header images, but with the "ALL" filter</s>
- <s>Add ability to archive/delete (or both) events and sermons</s>
- <s>Add ability to select several events/sermons and edit them (archive, delete)</s>
- <s>Add database tables for sermons, and usernames</s>

### Connecting APIs

- Connect the YouTube API to the Linganore United Methodist Church YouTube
- Add implementation with [VANCO PAYMENTS](https://www.vancopayments.com/)

### Nice to Haves

- REFACTOR APIs + dynamic pages

#### Admin Panel

- Add carousel option to headers (switches every X seconds)
- <s>Add ability to toggle sort events by date (so closest dates come up first)</s>
- <s>Add hide previous/upcoming toggle to events and sermons</s>

#### Frontend
