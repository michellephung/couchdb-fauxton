module.exports = {
	'getTimestamp' : function(){
		var time = new Date(),
         timestamp = "(date"+time.getDate()+
            "-"+(time.getMonth()+1)+
            "-"+time.getFullYear()+
            ")(time"+time.getHours()+
            "-"+time.getMinutes()+
            "-"+time.getMilliseconds()+")";
		return timestamp;
	}
}