export class SerialPortService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.reading = false;
    this.getdata = new Uint8Array(1000);  // 接收串口返回的数据
    this.DataPoint = 0;                    // 接收数据指针
    this.connecting = false;               // 是否正在通讯中
    this.getdatadelay = 25;                // 通讯超时
    this.time1 = null;                     // 定时器
  }

  // 判断是否是无符号整数
  isUIntNum(val) {
    const testval = /^\d+$/;  // 非负整数
    return testval.test(val);
  }

  // 判断是否是十六进制数
  isHex(val) {
    const testval = /^(\d|[A-F]|[a-f])+$/;  // 十六进制数判断
    return testval.test(val);
  }

  // 重置接收数据
  dispchange() {
    this.DataPoint = 0;
  }

  // 修改通讯超时时间
  ChangeDelayTime(delaytime) {
    this.getdatadelay = parseInt(delaytime);
  }

  // 通讯超时处理
  ConnTimeout() {
    clearInterval(this.time1);
    if (this.DataPoint > 0) {
      let listdatastr = "";
      for (let i = 0; i < this.DataPoint; i++) {
        listdatastr += this.getdata[i].toString(16).padStart(2, '0').toUpperCase() + " ";
      }
      return listdatastr;
    }
    this.DataPoint = 0;
    this.connecting = false;
  }

  // 选择串口
  async SelectSerial() {
    try {
      this.port = await navigator.serial.requestPort();  // 弹出系统串口列表对话框，选择一个串口进行连接
      const ports = await navigator.serial.getPorts();    // 获取已连接的授权过的设备列表
      return ports;
    } catch (e) {
      console.error(e);
    }
  }

  // 更新接收到的数据
  updateInputData(data) {
    const array = new Uint8Array(data);
    for (const value of array) {
      this.getdata[this.DataPoint] = value;
      this.DataPoint += 1;
    }

    if (!this.connecting) {
      this.connecting = true;
      this.time1 = setInterval(() => this.ConnTimeout(), this.getdatadelay);  // 开启通讯超时
    }
  }

  // 监听串口接收的数据
  async listenReceived() {
    if (this.reading) {
      console.log("On reading.");
      return;
    }
    this.reading = true;

    while (this.port.readable && this.reading) {
      this.reader = this.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          this.updateInputData(value);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.reader.releaseLock();
      }
    }

    await this.port.close();  // 关闭串口
    this.port = null;
    console.log("串口已关闭！");
  }

  // 打开串口
  async OpenSerial() {
    if (this.port === null) {
      throw new Error('请先选择要操作的串口号！');
    } else {
      const baudSelected = 57600;
      await this.port.open({
        baudRate: baudSelected,
      });
      await this.listenReceived();
      console.log('串口打开成功！');
    }
  }

  // 关闭串口
  async CloseSerial() {
    if (this.port === null || !this.port.writable) {
      throw new Error("请选择并打开与发卡器相连的串口！");
    }

    if (this.reading) {
      this.reading = false;
      this.reader?.cancel();
    }
  }
}