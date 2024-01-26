/**
 * 目前返回的是阿里云oss的缩略图地址，如果是其他平台，需要修改
 */
function getThumbUrl(url: string): string {
  return url + '?x-oss-process=image/resize,m_fill,w_100,quality,q_60'
}

async function delay(time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}


/**
 * 表格数据处理
 * 递归删除返回数据中的某个||children为空的数据
 * @param arr 数组
 */
function recursivelyDeletesAnElementFromAnArray<T>(arr: any[], item: string = 'children') {
  for (let i of arr) {
    if (i[item] === null || i[item].length === 0) {
      delete i[item]
    } else {
      recursivelyDeletesAnElementFromAnArray(i[item], item)
    }
  }
  return arr
}

export default { getThumbUrl, delay, recursivelyDeletesAnElementFromAnArray }
