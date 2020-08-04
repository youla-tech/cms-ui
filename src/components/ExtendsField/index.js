/* get extends */
export function  formatExtendFields (obj) {
  let extendObj={}
  let extendFieldKey="extend_field_"
  if(obj){
	  let nameArr = Object.keys(obj);
	  if(nameArr.length > 0){
		  nameArr.forEach(function(itemStr,index){
			  if(itemStr.indexOf(extendFieldKey) === 0){
				  let itemName= itemStr.replace(extendFieldKey,"");
				  extendObj[itemName] = obj[itemStr]
				  delete obj[itemStr];  //
			  }
		  })
		  
		  obj.extendParam = extendObj
	  }
  }
  return obj
  
}

