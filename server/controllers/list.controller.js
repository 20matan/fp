import List from '../models/list.model';
import { validate } from '../helpers/utils';

// function load(req, res, next, id) {
//   List.get(id)
//     .then((user) => {
//       req.user = user; // eslint-disable-line no-param-reassign
//       return next();
//     })
//     .catch(e => next(e));
// }

function get(req, res, next) {
  const { listId } = req.query;
  List.get(listId)
  .then((listFromDB) => {
    res.json(listFromDB);
  })
  .catch(next);
}

function create(req, res) {
  console.log('body123', req.body);
  const listData = validate(req.body,
    ['creator', 'type', 'meta']
  );
  console.log('fffffff', listData);
  const newList = new List(
    listData
  );
  newList.save()
  .then(savedList => res.json(savedList))
  .catch((e) => {
    console.error(e);
    res.send('error');
  });
  //
  // user.save()
  //   .then(savedUser => res.json(savedUser))
  //   .catch(e => next(e));
  // next();
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
  console.log('ahhhh list', req.query);
  const { limit = 50, skip = 0 } = req.query;
  List.list({ limit, skip })
    .then(lists => res.json(lists))
    .catch(e => next(e));
  // next();
}

function remove(req, res, next) {
  // const user = req.user;
  // user.remove()
  //   .then(deletedUser => res.json(deletedUser))
  //   .catch(e => next(e));
  next();
}

export default { get, create, update, list, remove };
