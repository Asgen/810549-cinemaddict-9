import {UserRank} from '../src/data/dictionaries.js';

const getUserRank = (count) => {
  let rank = ``;

  if (count > UserRank.BUFF_LIMIT) {
    rank = UserRank.BUFF;
  } else if (count > UserRank.FAN_LIMIT && count <= UserRank.BUFF_LIMIT) {
    rank = UserRank.FAN;
  } else if (count > 0 && count <= UserRank.FAN_LIMIT) {
    rank = UserRank.NOVICE;
  }

  return rank;
};

export {getUserRank};
