## TODO FINISH WITH MVP

### Frontend Changes

- Add event/sermon pages that display the data
  - Each event has a carousel (like [my website](https://www.natewbrooks.com)) at the bottom under the information to view all images/videos
- Make Recurring Events work on [Calendar](frontend/src/pages/Calendar.jsx)
- RESPONSIVE MOBILE!!

### Admin Panel Changes

- Make events have their own images (+ videos?) associated with them
- <s>Make events cancellable</s>
- <s>Add sermon data type -- should be a sort of "clone" with slight changes from events data types</s>
- JoinUs "Sermon Image URL" needs to be updated to be in the same format as the header images, but with the "ALL" filter
- Make "Recurring Events" flag toggle the "WEEKDAY SELECT" component.
  - Save the weekdays selected as the days of the current week. Frontend will know to distinguish based on "IsRecurring" flag
- Add ability to archive/delete (or both) events and sermons
- Add ability to select several events/sermons and edit them (archive, delete)
- Add JWT login authentication when hitting the /admin/ endpoint
- <s>Add database tables for sermons, and usernames</s>
  - Make sure to encrypt passwords of usernames with [bcrypt](https://www.npmjs.com/package/bcrypt)

### Connecting APIs

- Connect the YouTube API to the Linganore United Methodist Church YouTube
- Add implementation with [VANCO PAYMENTS](https://www.vancopayments.com/)

### Nice to Haves

- REFACTOR APIs + dynamic pages

#### Admin Panel

- Add carousel option to headers (switches every X seconds)
- Add ability to toggle sort events by date (so closest dates come up first)
- Add hide previous/upcoming toggle to events and sermons

#### Frontend
