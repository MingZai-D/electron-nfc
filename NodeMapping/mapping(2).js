var Template = {
    "Company Code":"01",
    "driver type":"FF",
    "Product Version": "FFFF",
    "Product Year": "FF",
    "production Week":"FF",
    "product serial No": "FFFF",
    "Feature Definition": "FF",

    "params":
    {
    "maxcv":{
    "maxcurrent": 1,
    "maxvoltage":1
    },
    "maxpower":"FF",
    "mincv":
    {
    "mincurrent":1,
    "minvoltage":1
    },
    "minpower":1,
    "testmode":false,
    "operationcurrent":"FFFF",
    "operationvoltage":"FFFF",
    "operationpower":"FFFF",
    "constantlumenenabled":"FF",
    "cloutputlevel14":["FF","FF","FF","FF"],
    "cloutputlevel57":["FF","FF","FF"],
    "cloperationtime14":["FF","FF","FF","FF"],
    "cloperationtime57":["FF","FF","FF"],
    "endoflifeenabled":"FF",
    "endoflifeindication":"FF",
    "softstartenabled":"FF",
    "dimtooff":"FF",
    "thermalprotectionenabled":"FF",
    "tpderatingstart":"FFFF",
    "tpderatingend":"FFFF",
    "tpminoutput":"FF",
    "dimingenabled":"FF",
    "dimingleel":"FF",
    "crc":"FF"
    }
    }


var writeList = [];
var exec = require('child_process').exec

function wait(ms)
{
    return new Promise(resolve => setTimeout(()=>resolve(), ms))
}

async function  ReadCallbackfromNFC(err, stdout, stderr)
{
    //console.log(err, ",",stdout,",",stderr);
    if(err != null )
    {
       console.log("Can't read NFC, try again")
       await wait(500)
       ReadNFCAll()
       return;
    }
    console.log("NFC Found, continue to display")
    reading = false
    var tags = stdout.split(' ')
    console.log(tags)

    //err 处理 TBD
    Template["Company Code"] = tags[0].substring(0,2)
    Template["driver type"] = tags[1].substring(0,2)
    Template["Product Version"] = tags[1].substring(2,6)
    Template["Product Year"] = tags[1].substring(6,8)
    Template["production Week"] = tags[2].substring(0,2)
    Template["product serial No"] = tags[2].substring(2,8)
    Template["Feature Definition"]= tags[3].substring(0,4)


    Template.params.maxcurrent = tags[4].substring(0,4)
    Template.params.maxvoltage = tags[4].substring(4,8)
    Template.params.maxpower = tags[5].substring(0,4)
    Template.params.mincurrent = tags[6].substring(0,4)
    Template.params.minvoltage = tags[6].substring(4,8)
    Template.params.minpower = tags[7].substring(0,4)

    
    Template.params.testmode = tags[8].substring(0,2)
    Template.params.operationcurrent = tags[9].substring(0,4)
    Template.params.operationvoltage = tags[9].substring(4,8)
    Template.params.operationpower = tags[10].substring(0,4)

    Template.params.constantlumenenabled =  tags[11].substring(0,2)

    Template.params.cloutputlevel14[0] =  tags[12].substring(0,2)
    Template.params.cloutputlevel14[1] =  tags[12].substring(2,4)
    Template.params.cloutputlevel14[2] =  tags[12].substring(4,6)
    Template.params.cloutputlevel14[3] =  tags[12].substring(6,8)
    Template.params.cloutputlevel57[0] =  tags[13].substring(0,2)
    Template.params.cloutputlevel57[1] =  tags[13].substring(2,4)
    Template.params.cloutputlevel57[2] =  tags[13].substring(4,6)

    Template.params.cloperationtime14[0] =  tags[14].substring(0,2)
    Template.params.cloperationtime14[1] =  tags[14].substring(2,4)
    Template.params.cloperationtime14[2] =  tags[14].substring(4,6)
    Template.params.cloperationtime14[3] =  tags[14].substring(6,8)
    Template.params.cloperationtime57[0] =  tags[15].substring(0,2)
    Template.params.cloperationtime57[1] =  tags[15].substring(2,4)
    Template.params.cloperationtime57[2] =  tags[15].substring(4,6)

    Template.params.endoflifeenabled =  tags[16].substring(0,2)
    Template.params.endoflifeindication =  tags[17].substring(0,2)

    Template.params.softstartenabled =  tags[18].substring(0,2)
    Template.params.dimtooff =  tags[19].substring(0,2)

    Template.params.thermalprotectionenabled =  tags[20].substring(0,2)
    Template.params.tpderatingstart = tags[21]
    Template.params.tpderatingend = tags[22]
    Template.params.tpminoutput = tags[23].substring(0,2)
    Template.params.dimingenabled = tags[24].substring(0,2)
    Template.params.dimingleel = tags[25].substring(0,2)
    Template.params.crc = tags[26].substring(0,2)    
 
    //CompositeWriteParam()
    //WriteNFCAll()
}
function trim2Two(value)
{
    var stringvalue = value.toString();
    if(stringvalue.length == 1)
    {
        stringvalue = "0" + stringvalue
    }
    else{
        stringvalue = stringvalue.substring(0,2)
    }
    return stringvalue

}

function CompositeWriteParam()
{
    var start = 32 - 8   //32 对应的是08 blob，然后顺序往下

    var FFHolder2 = "FF"
    var FFholder4 = "FFFF"
    var FFholder6 = "FFFFFF"

   /* writeList.push( (start + 4).toString() + Template.maxcurrent + Template.maxvoltage) //4+4 BIT
    writeList.push( (start + 5).toString() + Template.maxpower +  FFholder4)  // 4 BIT
    writeList.push( (start + 6).toString() + Template.mincurrent + Template.minvoltage) //4+4 BIT
    writeList.push( (start + 7).toString() + Template.minpower + FFholder4)  // 4 BIT*/

    writeList.length = 0
    writeList.push( (start + 8).toString() + Template.params.testmode + FFholder6)  // 2 BIT
    writeList.push( (start + 9).toString() + Template.params.operationcurrent + Template.params.operationvoltage) //4+4 BIT
    writeList.push( (start + 10).toString() + Template.params.operationpower + FFholder4) //4+4 BIT

    writeList.push( (start + 11).toString() + Template.params.constantlumenenabled + FFholder6) 
    writeList.push( (start + 12).toString() + Template.params.cloutputlevel14[0].toString() + Template.params.cloutputlevel14[1].toString() + Template.params.cloutputlevel14[2].toString() + Template.params.cloutputlevel14[3].toString()) 
    writeList.push( (start + 13).toString() + Template.params.cloutputlevel57[0].toString()  + Template.params.cloutputlevel57[1].toString()  + Template.params.cloutputlevel57[2].toString() + FFHolder2) 
    writeList.push( (start + 14).toString() + Template.params.cloperationtime14[0].toString() + Template.params.cloperationtime14[1].toString() + Template.params.cloperationtime14[2].toString() + Template.params.cloperationtime14[3].toString()) 
    writeList.push( (start + 15).toString() + Template.params.cloperationtime57[0].toString()  + Template.params.cloperationtime57[1].toString()  + Template.params.cloperationtime57[2].toString() + FFHolder2)
   
    writeList.push( (start + 16).toString() + Template.params.endoflifeenabled + FFholder6) 
    writeList.push( (start + 17).toString() + Template.params.endoflifeindication + FFholder6) 

    writeList.push( (start + 18).toString() + Template.params.softstartenabled + FFholder6) 
    writeList.push( (start + 19).toString() + Template.params.dimtooff + FFholder6) 

    writeList.push( (start + 20).toString() + Template.params.thermalprotectionenabled + FFholder6)
    writeList.push( (start + 21).toString() + Template.params.tpderatingstart)
    writeList.push( (start + 22).toString() + Template.params.tpderatingend)
    writeList.push( (start + 23).toString() + Template.params.tpminoutput + FFholder6)
    
    writeList.push( (start + 24).toString() + Template.params.dimingenabled + FFholder6)
    writeList.push( (start + 25).toString() + Template.params.dimingleel + FFholder6)
    writeList.push( (start + 26).toString() + Template.params.crc + FFholder6)
}

function writeCallbackfromNFC(err, stdout, stderr)
{
    console.log(err, ",",stdout,",",stderr);
    //if(err.length > =)  error 
}

var ReadNFCAll = function(){
    if(reading == false)
    {
        console.log("timeout")
        return;
    }
    exec('callNFC.exe 0031', ReadCallbackfromNFC) //read from 00 to 31
}


var WriteNFCAll = function()
{
    var comamndparam = ""
    for(var i = 0; i < writeList.length; i++)
    {
        comamndparam += " "
        comamndparam += writeList[i]
    }

    console.log(comamndparam,writeList.length)
    var command = 'callNFC.exe' + comamndparam
    //command = 'callNFC.exe 0212345678'
    console.log(command)
    exec(command, writeCallbackfromNFC) //read from 00 to 31
}


function GenerateCRCSample()
{

    var CRCModule = require('./CRC');
    //var byteArray = "012cffff01649da6b3c0cdff090f1e28323c4601ff010101000003e800000064640164"
    var bytesplite = "01 2c ff ff 01 64 9d a6 b3 c0 cd ff 09 0f 1e 28 32 3c 46 01 ff 01 01 01 00 00 03 e8 00 00 00 64 64 01 64";
    bytesplite = bytesplite.toUpperCase()
    var byte_array = bytesplite.split(' ').map(function(x){return CRCModule.HexStringToInt(x)})
    var crc8 = new CRCModule.CRC8(0x8c,0xff)
    
    console.log(byte_array)
    var checksum = crc8.checksum(byte_array)
    console.log(checksum)
}

function GenerateCRC()
{
    var CRCModule = require('./CRC');
    var crclist = [
        //0X24-0X27
        CRCModule.HexStringToInt(Template.params.operationcurrent.substring(0,2)),CRCModule.HexStringToInt(Template.params.operationcurrent.substring(2,4)),
        CRCModule.HexStringToInt(Template.params.operationvoltage.substring(0,2)),CRCModule.HexStringToInt(Template.params.operationvoltage.substring(2,4)),
        //0x2c
        CRCModule.HexStringToInt(Template.params.constantlumenenabled.substring(0,2)),
        //0x30-0x33
        CRCModule.HexStringToInt(Template.params.cloutputlevel14[0].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloutputlevel14[1].substring(0,2)),
        CRCModule.HexStringToInt(Template.params.cloutputlevel14[2].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloutputlevel14[3].substring(0,2)),
        //0x34-0x36
        CRCModule.HexStringToInt(Template.params.cloutputlevel57[0].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloutputlevel57[1].substring(0,2)),
        CRCModule.HexStringToInt(Template.params.cloutputlevel57[2].substring(0,2)),
        //0x38-0x3e
        CRCModule.HexStringToInt(Template.params.cloperationtime14[0].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloperationtime14[1].substring(0,2)),
        CRCModule.HexStringToInt(Template.params.cloperationtime14[2].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloperationtime14[3].substring(0,2)),
        CRCModule.HexStringToInt(Template.params.cloperationtime57[0].substring(0,2)),CRCModule.HexStringToInt(Template.params.cloperationtime57[1].substring(0,2)),
        CRCModule.HexStringToInt(Template.params.cloperationtime57[2].substring(0,2)),

        //0x40,44,48,4c,50
        CRCModule.HexStringToInt(Template.params.endoflifeenabled.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.endoflifeindication.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.softstartenabled.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.dimtooff.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.thermalprotectionenabled.substring(0,2)),

        //0X53-57
        CRCModule.HexStringToInt(Template.params.tpderatingstart.substring(0,2)),CRCModule.HexStringToInt(Template.params.tpderatingstart.substring(2,4)),
        CRCModule.HexStringToInt(Template.params.tpderatingstart.substring(4,6)),CRCModule.HexStringToInt(Template.params.tpderatingstart.substring(6,8)),

        //0X58-5B
        CRCModule.HexStringToInt(Template.params.tpderatingend.substring(0,2)),CRCModule.HexStringToInt(Template.params.tpderatingend.substring(2,4)),
        CRCModule.HexStringToInt(Template.params.tpderatingend.substring(4,6)),CRCModule.HexStringToInt(Template.params.tpderatingend.substring(6,8)),

        //0X5C,60,64
        CRCModule.HexStringToInt(Template.params.tpminoutput.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.dimingenabled.substring(0,2)),
        CRCModule.HexStringToInt(Template.params.dimingleel.substring(0,2)),
    ]
    console.log(crclist)
    
    var crc8 = new CRCModule.CRC8(0x8c,0xff)
    
    var checksum = crc8.checksum(crclist)
    console.log(checksum)
    var crc_value = checksum.toString(16).toUpperCase()
    if(crc_value.length == 1)
    {
        crc_value = "0" + value
    }
    crc_value = crc_value.substring(0,2)
    console.log(crc_value)
    return crc_value
}

function EnableDisableFromFeatureDefinition()
{
    var CRCModule = require('./CRC');
    var def= CRCModule.HexStringToInt("007f")
    console.log(def)
    var driverparam_enable = (def & 1) == 1? true : false
    var constantlumen_enable =  (def >>> 1 & 1) == 1? true : false
    var endoflife_enable =  (def >>> 2 & 1) == 1? true : false
    var softstart_enable =  (def >>> 3 & 1) == 1? true : false
    var dimtooff_enable =  (def >>> 4 & 1) == 1? true : false
    var thermalprotect_enable =  (def >>> 5 & 1) == 1? true : false
    var dimming_enable =  (def >>> 6 & 1) == 1? true : false
    console.log(driverparam_enable,constantlumen_enable,endoflife_enable,softstart_enable,dimtooff_enable,thermalprotect_enable,dimming_enable)
}
 var reading = false
setTimeout(function()
{
    reading = false;
}, 5000
)
console.log("beging reading")
reading = true
ReadNFCAll()

