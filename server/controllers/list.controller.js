import List from '../models/list.model';
import { validate } from '../helpers/utils';

function load(req, res, next, id) {
  List.get(id)
    .then((listFromDB) => {
      req.list = listFromDB; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res, next) {
  const { listId } = req.query;
  List.get(listId)
  .then((listFromDB) => {
    res.json(listFromDB);
  })
  .catch(next);
}

function create(req, res, next) {
  const listData = validate(req.body,
    ['creator', 'type', 'meta']
  );
  const newList = new List(
    listData
  );
  newList.save()
  .then(savedList => res.json(savedList))
  .catch(e => next(e));
}

function update(req, res, next) {
  // const user = req.user;
  //
  // user.save(req.body)
  //   .then(savedUser => res.json(savedUser))
  //   .catch(e => next(e));
  next();
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  List.list({ limit, skip })
    .then(lists => res.json(lists))
    .catch(e => next(e));
}

function remove(req, res, next) {
  // const user = req.user;
  // user.remove()
  //   .then(deletedUser => res.json(deletedUser))
  //   .catch(e => next(e));
  next();
}

function addUser(req, res, next) {
  const { username } = req.body;
  const listInReq = req.list;
  if (listInReq.users.includes(username)) {
    next(new Error('User already in the queue'));
    return;
  }
  listInReq.users.push(username);
  listInReq.save()
  .then(savedList => res.json(savedList))
  .catch(e => next(e));
}

export default { get, create, update, list, load, remove, addUser };
