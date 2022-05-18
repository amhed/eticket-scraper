import _ from 'lodash'

/** pause execution for 2 mins */
export const pause = () => {
  return delay(60 * 2 * 2000)
}

/* delay execution for min to max seconds */
export const delay = (min?: number, max?: number) => {
  min = min ?? 1000
  max = max ?? 5000

  const time = _.random(min, max)
  return new Promise(resolve => {
    setTimeout(resolve, time)
  });
};
