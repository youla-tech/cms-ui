/* get extends */
export function formatExtendFields (obj) {
  const extendObj = {}
  const extendFieldKey = 'extend_field_'
  if (obj) {
    const nameArr = Object.keys(obj)
    if (nameArr.length > 0) {
      nameArr.forEach(function (itemStr, index) {
        if (itemStr.indexOf(extendFieldKey) === 0) {
          const itemName = itemStr.replace(extendFieldKey, '')
          extendObj[itemName] = obj[itemStr]
          delete obj[itemStr] //
        }
      })

      obj.extendParam = extendObj
    }
  }
  return obj
}
