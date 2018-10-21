/*
** 导出csv文件
** by xiaoah
** 2018/10/7
 */

var toCSV = function (gridId, ignoredTemplates) {
    var csv = '';

    // Get access to basic grid data
    var grid = $("#" + gridId).data("kendoGrid"),
        datasource = grid.dataSource,
        originalPageSize = datasource.pageSize();

    // Increase page size to cover all the data and get a reference to that data
//    datasource.pageSize(datasource.total());
    var data = datasource.view();
    console.log("data: ", data)

    var fieldList = [];

    //add the header row
    for (var i = 0; i < grid.columns.length; i++) {
        var title = grid.columns[i].title,
            field = grid.columns[i].field;
        if (typeof (field) === "undefined") { continue; /* no data! */ }
        if (typeof (title) === "undefined") { title = field }

        fieldList.push(field);
        title = title.replace(/"/g, '""');
        csv += '"' + title + '"';
        if (i < grid.columns.length - 1) {
            csv += ",";
        }
    }
    csv += "\n";
	console.log("测试域 ",fieldList);
	console.log("好 ",data["0"]["CLSJ"]);
	for(var row = 0; row < originalPageSize; row++){
	    var index = row.toString();

	    if (typeof (data[index]) !== "undefined"){
            for(var i=0; i < fieldList.length; i++){
                csv += data[index][fieldList[i]] + ",";
            }
            csv += "\n";
        }


    }
    // for(var row in data){
	 //    for(var i=0; i< fieldList.length;i++){
	 //        var item = data[row][fieldList[i]]
	 //        csv += data[row][fieldList[i]] + ",";
    //     }
    //     csv += "\n";
    // }

    //add each row of data
    // for (var row in data) {
    //     console.log("测试", data[row]["CLSJ"])
    //     for (var i = 0; i < grid.columns.length; i++) {
    //         var fieldName = grid.columns[i].field,
		// 		template = grid.columns[i].template;
    //
    //         if (typeof (fieldName) === "undefined") { continue; }
    //
    //         var value = data[row][fieldName];
    //
    //         if (value === null) {
    //             value = "";
    //         } else {
		// 		if ((typeof(template) !== "undefined") && ($.inArray(fieldName.toString(), ignoredTemplates) < 0)) {
		// 			value = value.toString();
		// 			var kt = kendo.template(template.toString());
		// 			value = kt(data[row]);
		// 		} else {
		// 			value = value.toString();
		// 		}
    //         }
    //
    //         value = value.replace(/"/g, '""');
    //         csv += '"' + value + '"';
    //         if (i < grid.columns.length - 1) {
    //             csv += ",";
    //         }
    //     }
    //     csv += "\n";
    // }
    //
    // // Reset datasource
    // datasource.pageSize(originalPageSize);

    return csv;
};
