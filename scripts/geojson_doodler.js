var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);

L.tileLayer('http://{s}.tiles.mapbox.com/v3/skwidbreth.044joc73/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);


var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
    draw: {
        circle: false
    },
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);




function addPropertyFields(x){
    $(x).next(".properties_container").append("<tr class='properties_row'><td><input type='text' class='property' placeholder='Property' /></td><td><input type='text' class='value' placeholder='Value' /></td><td><button class='remove'>Remove</button></td></tr>");
};

function removePropertyFields(x){
    $(x).parent().parent().remove();
};



var popupFields = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'></table><button class='popup_save'>Save properties</button>";


$(document).on("click", ".add_property", function(){
    addPropertyFields(this);
});

$(document).on("click", ".remove", function(){
    removePropertyFields(this);
});





map.on('draw:created', function(e){
    featureGroup.addLayer(e.layer);
    e.layer.bindPopup(popupFields).openPopup();
    
    
    
    function popupSave(x){

        propertiesTable = $(x).prev();
        propertiesRows = propertiesTable.find(".properties_row");
        
        propertiesObject = {};
        
        $(propertiesRows).each(function(){
            
            property = $(this).find(".property").val();
            value = $(this).find(".value").val();
            
            propertiesObject[property] = value;
        });
        
        return propertiesObject;
    };
    
    
    

    $('.popup_save').click(function(){
        popupSave(this);
        e.layer.properties = propertiesObject;
    });
    
    
    
    

    e.layer.on('click', function(){
        if(e.layer.properties){
            popupFieldsEdit = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'>";
            
            $.each(e.layer.properties, function(property, value){
                popupFieldsEdit += "<tr class='properties_row'><td><input type='text' class='property' value='"+property+"' placeholder='Property' /></td><td><input type='text' class='value' value='"+value+"' placeholder='Value' /></td><td><button class='remove'>Remove</button></td></tr>";
            });
            
            popupFieldsEdit += "</table><button class='popup_save'>Save</button>";
            
            e.layer.bindPopup(popupFieldsEdit).openPopup();
            
            $('.popup_save').click(function(){
                popupSave(this);
                e.layer.properties = propertiesObject;
            });
        }
        else{
            e.layer.bindPopup(popupFields).openPopup();
        };
    });

});





function save(){    

    geoJSONArray = [];
    
    if(Object.keys(featureGroup._layers).length == 0){
        return false;
    }
    else{
        $.each(featureGroup._layers, function(key, value){
            geoObject = value.toGeoJSON();
            geoObject.properties = value.properties;
            type = geoObject.geometry.type;
            geoObjectString = JSON.stringify(geoObject);
            geoJSONArray.push(geoObjectString);
         });
    };
    
    return geoJSONArray;
};





function exportTableToCSV($table, filename){

    var $rows = $table.find('tr:has(td)'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function (i, row) {
            var $row = $(row),
                $cols = $row.find('td');

            return $cols.map(function (j, col) {
                var $col = $(col),
                    text = $col.text();

                return text.replace(/"/g, '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"',

        // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);



    $(this)
        .attr({
        'download': filename,
        'href': csvData,
        'target': '_blank'
    });
};