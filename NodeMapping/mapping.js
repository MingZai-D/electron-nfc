
export const Template = {
  "Company Code": "01",
  "driver type": "FF",
  "Product Version": "FFFF",
  "Product Year": "FF",
  "production Week": "FF",
  "product serial No": "FFFF",
  "Feature Definition": "FF",

  "params": {
    "maxcv": {
      "maxcurrent": 1,
      "maxvoltage": 1
    },
    "maxpower": "FF",
    "mincv": {
      "mincurrent": 1,
      "minvoltage": 1
    },
    "minpower": 1,
    "testmode": "00",
    "faultcode": "000000",
    "faultcodecrc": "000000",
    "operationcurrent": "FFFF",
    "operationvoltage": "FFFF",
    "operationpower": "FFFF",
    "constantlumenenabled": "FF",
    "cloutputlevel14": ["FF", "FF", "FF", "FF"],
    "cloutputlevel57": ["FF", "FF", "FF"],
    "cloperationtime14": ["FF", "FF", "FF", "FF"],
    "cloperationtime57": ["FF", "FF", "FF"],
    "endoflifeenabled": "FF",
    "endoflifeindication": "FF",
    "softstartenabled": "FF",
    "dimtooff": "FF",
    "thermalprotectionenabled": "FF",
    "tpderatingstart": "FFFF",
    "tpderatingend": "FFFF",
    "tpminoutput": "FF",
    "dimingenabled": "FF",
    "dimingleel": "FF",
    "crc": "FF"
  }
}

export const modeList = {
  "1": {
    "modelName": "LEDrv25/UNV/C/1250/DIM1/AUX12/NFC"
  },
  "2": {
    "modelName": "LEDrv25/UNV/C/1250/DIM1/J/AUX12/NFC"
  },
  "3": {
    "modelName": "LEDrv40/UNV/C/1400/DIM1/AUX12/NFC"
  },
  "4": {
    "modelName": "LEDrv40/UNV/C/1400/DIM1/J/AUX12/NFC"
  },
  "5": {
    "modelName": "LEDrv100/UNV/1250/DIM/AUX12/P6/NFC"
  },
  "6": {
    "modelName": "LEDrv180/UNV/1250/DIM/AUX12/P6/NFC"
  },
  "7": {
    "modelName": "LEDrv36/UNV/L/1000/DIM1/AUX12/NFC"
  },
  "8": {
    "modelName": "LEDrv55/UNV/L/1300/DIM1/AUX12/NFC"
  },
  "9": {
    "modelName": "LEDrv88/UNV/L/2400/DIM1/AUX12/NFC"
  }
}

export const faultDescriptionList = {
  "0": "Read Fault code failed, please try read the tag again",
  "1": "Electric leakage",
  "2": "Short-Circuit protection",
  "3": "Luminaire temperature is too high, Thermal protection is luanch",
  "4": "Wrong thermistor(detect wrong thermal resistor value at 25℃",
  "5": "Wrong current value, the current value you set is out of range",
  "6": "Overloaded, requested power exceed the maximum power value of driver.",
  "7": "Wrong dimming level value, dimming level value set is not in the range",
  "8": "Wrong percentage value on constant lumen function, cause overload issue",
  "9": "Driver is protected, beceause the inner componet temperature  is too high",
  "10": "Used wrong App or Software to read and write the data from driver",
  "11": "External Supply Undervoltage",
  "12": "External Supply Overvoltage",
  "13": "Open circuit on output loop"
}


const {
  exec
} = window.require('child_process')

function ReadCallbackfromNFC(err, stdout, stderr) {
  console.log(err, '', stdout, '', stderr, 'wwww')
  if (err !== null || stderr !== "") {
    return
  }
  console.log(stderr, 'stderr')
  var tags = stdout.split(' ')
  console.log(tags, 'tags')
  //err 处理 TBD
  Template["Company Code"] = tags[0].substring(0, 2)
  Template["driver type"] = tags[1].substring(0, 2)
  Template["Product Version"] = tags[1].substring(2, 6)
  Template["Product Year"] = tags[1].substring(6, 8)
  Template["production Week"] = tags[2].substring(0, 2)
  Template["product serial No"] = tags[2].substring(2, 8)
  Template["Feature Definition"] = tags[3].substring(0, 4)


  Template.params.maxcurrent = tags[4].substring(0, 4)
  Template.params.maxvoltage = tags[4].substring(4, 8)
  Template.params.maxpower = tags[5].substring(0, 4)
  Template.params.mincurrent = tags[6].substring(0, 4)
  Template.params.minvoltage = tags[6].substring(4, 8)
  Template.params.minpower = tags[7].substring(0, 4)


  Template.params.testmode = tags[8].substring(0, 2)
  Template.params.operationcurrent = tags[9].substring(0, 4)
  Template.params.operationvoltage = tags[9].substring(4, 8)
  Template.params.operationpower = tags[10].substring(0, 4)

  Template.params.constantlumenenabled = tags[11].substring(0, 2)

  Template.params.cloutputlevel14[0] = tags[12].substring(0, 2)
  Template.params.cloutputlevel14[1] = tags[12].substring(2, 4)
  Template.params.cloutputlevel14[2] = tags[12].substring(4, 6)
  Template.params.cloutputlevel14[3] = tags[12].substring(6, 8)
  Template.params.cloutputlevel57[0] = tags[13].substring(0, 2)
  Template.params.cloutputlevel57[1] = tags[13].substring(2, 4)
  Template.params.cloutputlevel57[2] = tags[13].substring(4, 6)

  Template.params.cloperationtime14[0] = tags[14].substring(0, 2)
  Template.params.cloperationtime14[1] = tags[14].substring(2, 4)
  Template.params.cloperationtime14[2] = tags[14].substring(4, 6)
  Template.params.cloperationtime14[3] = tags[14].substring(6, 8)
  Template.params.cloperationtime57[0] = tags[15].substring(0, 2)
  Template.params.cloperationtime57[1] = tags[15].substring(2, 4)
  Template.params.cloperationtime57[2] = tags[15].substring(4, 6)

  Template.params.endoflifeenabled = tags[16].substring(0, 2)
  Template.params.endoflifeindication = tags[17].substring(0, 2)

  Template.params.softstartenabled = tags[18].substring(0, 2)
  Template.params.dimtooff = tags[19].substring(0, 2)

  Template.params.thermalprotectionenabled = tags[20].substring(0, 2)
  Template.params.tpderatingstart = tags[21]
  Template.params.tpderatingend = tags[22]
  Template.params.tpminoutput = tags[23].substring(0, 2)
  Template.params.dimingenabled = tags[24].substring(0, 2)
  Template.params.dimingleel = tags[25].substring(0, 2)
  Template.params.crc = tags[26].substring(0, 2)
  Template.params.faultcode = tags[31].substring(0,6)
  Template.params.faultcodecrc = tags[31].substring(6,8)

  Template.params.faultcodegentercrc = GenerateFaultCodeCRC([tags[31].substring(0,2),tags[31].substring(2,4),tags[31].substring(4,6)])
  Template.params.promptCode = tags[31].substring(4,6)
  console.log(Template, 'Template', Template.params.crc, 'crc')
  // CompositeWriteParam()
  // WriteNFCAll()
}
export const trim2Two = function (value) {
  var stringvalue = value.toString();
  if (stringvalue.length == 1) {
    stringvalue = "0" + stringvalue
  } else {
    stringvalue = stringvalue.substring(0, 2)
  }
  return stringvalue

}

export const CompositeWriteParam = function (Template, writeA2) {
  console.log(writeA2, Template, 'Templatesss')
  var writeList = [];
  writeList.length = 0
  var start = 32 - 8 //32 对应的是08 blob，然后顺序往下



  var FFHolder2 = "FF"
  var FFholder4 = "FFFF"
  var FFholder6 = "FFFFFF"

  /* writeList.push( (start + 4).toString() + Template.maxcurrent + Template.maxvoltage) //4+4 BIT
   writeList.push( (start + 5).toString() + Template.maxpower +  FFholder4)  // 4 BIT
   writeList.push( (start + 6).toString() + Template.mincurrent + Template.minvoltage) //4+4 BIT
   writeList.push( (start + 7).toString() + Template.minpower + FFholder4)  // 4 BIT*/

  if (writeA2 == true) {
    start = 0;
    writeList.push('08' + Template.params.testmode + FFholder6)
    // 2 BIT
    writeList.push('09' + Template.params.operationcurrent + Template.params.operationvoltage) //4+4 BIT
  } else {
    writeList.push((start + 8).toString() + Template.params.testmode + FFholder6)
    writeList.push((start + 9).toString() + Template.params.operationcurrent + Template.params.operationvoltage) //4+4 BIT
  }

  writeList.push((start + 10).toString() + Template.params.operationpower + FFholder4) //4+4 BIT

  writeList.push((start + 11).toString() + Template.params.constantlumenenabled + FFholder6)
  writeList.push((start + 12).toString() + Template.params.cloutputlevel14[0].toString() + Template.params.cloutputlevel14[1].toString() + Template.params.cloutputlevel14[2].toString() + Template.params.cloutputlevel14[3].toString())
  writeList.push((start + 13).toString() + Template.params.cloutputlevel57[0].toString() + Template.params.cloutputlevel57[1].toString() + Template.params.cloutputlevel57[2].toString() + FFHolder2)
  writeList.push((start + 14).toString() + Template.params.cloperationtime14[0].toString() + Template.params.cloperationtime14[1].toString() + Template.params.cloperationtime14[2].toString() + Template.params.cloperationtime14[3].toString())
  writeList.push((start + 15).toString() + Template.params.cloperationtime57[0].toString() + Template.params.cloperationtime57[1].toString() + Template.params.cloperationtime57[2].toString() + FFHolder2)

  writeList.push((start + 16).toString() + Template.params.endoflifeenabled + FFholder6)
  writeList.push((start + 17).toString() + Template.params.endoflifeindication + FFholder6)

  writeList.push((start + 18).toString() + Template.params.softstartenabled + FFholder6)
  writeList.push((start + 19).toString() + Template.params.dimtooff + FFholder6)

  writeList.push((start + 20).toString() + Template.params.thermalprotectionenabled + FFholder6)
  writeList.push((start + 21).toString() + Template.params.tpderatingstart)
  writeList.push((start + 22).toString() + Template.params.tpderatingend)
  writeList.push((start + 23).toString() + Template.params.tpminoutput + FFholder6)

  writeList.push((start + 24).toString() + Template.params.dimingenabled + FFholder6)
  writeList.push((start + 25).toString() + Template.params.dimingleel + FFholder6)
  Template.params.crc = GenerateCRC(Template)
  writeList.push((start + 26).toString() + Template.params.crc + FFholder6)
  let list = []
  writeList.forEach(function (item) {
    list.push(item.toUpperCase())
  })
  return WriteNFCAll(writeList, Template, writeA2)
}

function writeCallbackfromNFC(err, stdout, stderr) {
  console.log(err, ",", stdout, ",", stderr);
  //if(err.length > =)  error 
}

export const RedCRC = function (a3 = false) {
  var block = a3 ? "50" : "26";
  const path = window.require('path')
  let exePath = path.resolve('./')
  return new Promise(resolve => {
    const lss = exec('callNFC.exe ' + block, {
      cwd: exePath + "\\NodeMapping"
    }, ReadCRCCallback) //read from 00 to 31
    let str = ''
    lss.stdout.on('data', (data) => {
      str += data
    })
    lss.on('close', (code) => {
      resolve({
        code,
        crc: str.substring(0, 2)
      })
    })
  })

}

export const ReadCRCCallback = function (err, stdout, stderr) {
  if (err !== null || stderr !== "") {
    return
  }
  console.log(stderr, 'stderr', stdout, stdout.substring(0, 2), 'stdout')
  // return stdout.substring(0, 2)
}


export const ReadNFCAll = function () {
  const path = window.require('path')
  let exePath = path.resolve('./')
  return new Promise(resolve => {
    const ls = exec('callNFC.exe 0031', {
      cwd: exePath + "\\NodeMapping"
    }, ReadCallbackfromNFC) //read from 00 to 31
    ls.on('close', (code) => {
      const res = GenerateCRC()
      console.log(res,Template,'crc')
      let crcStatus = res == Template.params.crc ? false : true
      const enable = EnableDisableFromFeatureDefinition()
      if (Template["Company Code"] == '00' && Template["driver type"] == '00' && Template["production Week"] == '00') code = 1
      resolve({
        status: code,
        data: JSON.parse(JSON.stringify(Template)),
        crcStatus,
        enable
      })
    })
  })
}


export const WriteNFCAll = function (writeList, Template, writeA2,) {
  const path = window.require('path')
  let exePath = path.resolve('./')
  var comamndparam = ""
  for (var i = 0; i < writeList.length; i++) {
    comamndparam += " "
    comamndparam += writeList[i]
  }

  var command = 'callNFC.exe' + comamndparam
  //command = 'callNFC.exe 0212345678'
  console.log(command)
  return new Promise(resolve => {
    const ls = exec(command, {
      cwd: exePath + "\\NodeMapping"
    }, writeCallbackfromNFC) //read from 00 to 31
    ls.on('close', (code) => {
      RedCRC(!writeA2).then(res => {
        console.log(res, 'writeRes')
        const CRCres = GenerateCRC(Template)
        console.log(CRCres,'CRCres')
        let msg = code === 0 ? 'Next: Power up the driver to activate your new settings' : 'Write failed'
        if (res.crc != CRCres && code === 0) msg = 'Write crc operation failed'
        resolve({
          status: code,
          msg
        })
      })
    })
  })
}

function GenerateCRC( template) {
  const temp = template ? template : Template
  var CRCModule = require('./CRC');
  var crclist = [
    //0X24-0X27
    CRCModule.HexStringToInt(temp.params.testmode.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.operationcurrent.substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.operationcurrent.substring(2, 4)),
    CRCModule.HexStringToInt(temp.params.operationvoltage.substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.operationvoltage.substring(2, 4)),
    CRCModule.HexStringToInt(temp.params.operationpower.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.operationpower.substring(2, 4)),

    //0x2c
    CRCModule.HexStringToInt(temp.params.constantlumenenabled.substring(0, 2)),
    //0x30-0x33
    CRCModule.HexStringToInt(temp.params.cloutputlevel14[0].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloutputlevel14[1].substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.cloutputlevel14[2].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloutputlevel14[3].substring(0, 2)),
    //0x34-0x36
    CRCModule.HexStringToInt(temp.params.cloutputlevel57[0].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloutputlevel57[1].substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.cloutputlevel57[2].substring(0, 2)),
    //0x38-0x3e
    CRCModule.HexStringToInt(temp.params.cloperationtime14[0].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloperationtime14[1].substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.cloperationtime14[2].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloperationtime14[3].substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.cloperationtime57[0].substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.cloperationtime57[1].substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.cloperationtime57[2].substring(0, 2)),

    //0x40,44,48,4c,50
    CRCModule.HexStringToInt(temp.params.endoflifeenabled.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.endoflifeindication.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.softstartenabled.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.dimtooff.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.thermalprotectionenabled.substring(0, 2)),

    //0X53-57
    CRCModule.HexStringToInt(temp.params.tpderatingstart.substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.tpderatingstart.substring(2, 4)),
    CRCModule.HexStringToInt(temp.params.tpderatingstart.substring(4, 6)), 
    CRCModule.HexStringToInt(temp.params.tpderatingstart.substring(6, 8)),

    //0X58-5B
    CRCModule.HexStringToInt(temp.params.tpderatingend.substring(0, 2)), 
    CRCModule.HexStringToInt(temp.params.tpderatingend.substring(2, 4)),
    CRCModule.HexStringToInt(temp.params.tpderatingend.substring(4, 6)), 
    CRCModule.HexStringToInt(temp.params.tpderatingend.substring(6, 8)),

    //0X5C,60,64
    CRCModule.HexStringToInt(temp.params.tpminoutput.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.dimingenabled.substring(0, 2)),
    CRCModule.HexStringToInt(temp.params.dimingleel.substring(0, 2)),

  ]
  console.log(crclist, 'crclist')
  var crc8 = new CRCModule.CRC8(0x8c, 0xff)

  var checksum = crc8.checksum(crclist)
  var crc_value = checksum.toString(16).toUpperCase()
  if (crc_value.length == 1) {
    crc_value = "0" + crc_value
  }
  console.log(crc_value, 'crc_value.substring')
  crc_value = crc_value.substring(0, 2)
  return crc_value
}

function GenerateFaultCodeCRC(list){
  console.log(list,'list')
  var CRCModule = require('./CRC');
  var crcList = [
    CRCModule.HexStringToInt(list[0]),
    CRCModule.HexStringToInt(list[1]),
    CRCModule.HexStringToInt(list[2])
  ]
  var crc8 = new CRCModule.CRC8(0x8c, 0xff)

  var checksum = crc8.checksum(crcList)
  var crc_value = checksum.toString(16).toUpperCase()
  if (crc_value.length == 1) {
    crc_value = "0" + crc_value
  }
  crc_value = crc_value.substring(0, 2)
  return crc_value
}

export const EnableDisableFromFeatureDefinition = function () {
  var CRCModule = require('./CRC');
  var def = CRCModule.HexStringToInt(Template['Feature Definition'])
  var driverparam_enable = (def & 1) == 1 ? true : false
  var constantlumen_enable = (def >>> 1 & 1) == 1 ? true : false
  var endoflife_enable = (def >>> 2 & 1) == 1 ? true : false
  var softstart_enable = (def >>> 3 & 1) == 1 ? true : false
  var dimtooff_enable = (def >>> 4 & 1) == 1 ? true : false
  var thermalprotect_enable = (def >>> 5 & 1) == 1 ? true : false
  var dimming_enable = (def >>> 6 & 1) == 1 ? true : false
  const enable = {
    endoflife: endoflife_enable,
    softstart: softstart_enable,
    dimtooff: dimtooff_enable,
    thermalprotection: thermalprotect_enable,
    diming: dimming_enable,
    constantlumen: constantlumen_enable,
    opcurrent: driverparam_enable
  }
  return enable
}