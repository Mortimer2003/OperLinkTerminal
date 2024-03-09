export function timeAgo(timestamp: number) {

  // 定义时间单位的毫秒数
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (timestamp < minute) {
    return '刚刚';
  } else if (timestamp < hour) {
    const minutes = Math.floor(timestamp / minute);
    return `${minutes} 分钟前`;
  } else if (timestamp < day) {
    const hours = Math.floor(timestamp / hour);
    return `${hours} 小时前`;
  } else if (timestamp < week) {
    const days = Math.floor(timestamp / day);
    return `${days} 天前`;
  } else if (timestamp < month) {
    const weeks = Math.floor(timestamp / week);
    return `${weeks} 周前`;
  } else if (timestamp < year) {
    const months = Math.floor(timestamp / month);
    return `${months} 个月前`;
  } else {
    const years = Math.floor(timestamp / year);
    return `${years} 年前`;
  }
}
