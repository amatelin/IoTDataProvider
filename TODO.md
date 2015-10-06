# Todo
### Front-end
* fix frontend on landing page (make responsive)
* verify responsiveness on other views

### Back-end
* Global refactoring (check error handling, probably improve debug messages printing using a middleware instead of simply calling console.log())
* Create API class that can stream data from a csv (either stored locally or remotly). Should be able to manipulate data for the payload : send unique value identified by row and col number, send whole row, whole column (id by index or name), max/min/avr value/row||col
* Implement unit tests
* (is it possible?) Find a way to add new APIs in a more normalized fashion (only 1 json config file for all APIs. Json will be interpreted by app and classes/methods will be created dynamically)

### Bugs


# In progress

# Done
* Fix bug on edit view : the form doesn't save the right data (form values are re-initialized with the wrong values - not corresponding to the client's state)