import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
// import Graph from "./Graph";
import Stream from "./Stream";

// type data = {
//   time: number;
//   red: number;
//   ir: number;
// };

const Monitor = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [port, setPort] = useState<SerialPort>();

  const [serialData, setSerialData] = useState<any[]>([]);
  const [serialDataset, setSerialDataset] = useState<any[]>([]);
  const [serialDataNum, setSerialDataNum] = useState<number>(0);

  // const [dat, setDat] = useState<data>();
  // const [dats, setDats] = useState<data[]>([]);

  const [time, setTime] = useState<any[]>([0]);
  const [data, setData] = useState<any[]>([0]);

  class LineBreakTransformer {
    chunks: string;
    controller: any;

    constructor() {
      this.chunks = "";
    }

    transform(chunk: string, controller: any) {
      this.chunks += chunk;
      const lines = this.chunks.split("\r\n");
      this.chunks = lines.pop() || "";
      lines.forEach((line) => controller.enqueue(line));
    }

    flush(controller: any) {
      controller.enqueue(this.chunks);
    }
  }

  useEffect(() => {
    if ("serial" in navigator) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (port) {
      const OpenPort = async () => {
        try {
          await port.open({ baudRate: 115200 });
          console.log("Port is open.");
        } catch (err) {
          console.error("Error opening port:", err);
        }

        while (port.readable) {
          const textDecoder = new TextDecoderStream();
          const readableStreamClosed = port.readable.pipeTo(
            textDecoder.writable,
          );
          const reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

          try {
            let times = 0;
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                console.log("Canceled");
                break;
              }
              if (times < 10) {
                times += 1;
              } else {
                const v: String[] = value.split("\t");
                setSerialData(v);
              }

              // (serialDataNum === (v.length - 1)) && setSerialData(v);
            }
          } catch (error) {
            console.log("Error: Read");
            console.log(error);
          } finally {
            reader.releaseLock();
          }
        }
      };
      OpenPort();
    }
  }, [port]);

  // useEffect(() => {
  //   if (dat) {
  //     const dd: data[] = [...dats, dat];
  //     setDats(dd);
  //     // console.log(dd)
  //   }
  // }, [dat]);

  useEffect(() => {
    if (serialData[0]) {
      const v: any[] = [...serialDataset, serialData];
      setSerialDataset(v);
    }
  }, [serialData]);

  const ConnectClicked = async () => {
    try {
      setPort(await navigator.serial.requestPort());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-5">
      <div>
        {isSupported && (
          <div className="text-sm">Web Serial API is Supported.</div>
        )}
      </div>
      {/* <div className="relative"> */}
      {/*   <select className="w-40 p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"> */}
      {/*       {[1, 2, 3, 4, 5].map((value) => <option>{value}</option>)} */}
      {/*   </select> */}
      {/* </div> */}

      {/* <div> */}
      {/*   <input */}
      {/*     value={serialDataNum} */}
      {/*     onChange={(e) => setSerialDataNum(Number(e.target.value))} */}
      {/*     className="w-40 p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600" */}
      {/*   /> */}
      {/* </div> */}

      <ConnectButton onClick={ConnectClicked}>Connect</ConnectButton>
      {/* <div>{dat && dat.time}</div> */}
      {/* <Graph dat={dat} /> */}
      <Stream data={serialDataset} />
      <button
        type="button"
        onClick={() => {
          const t = time.slice(-1)[0] + 1;
          setTime([...time, t]);
          setData([...data, Math.random()]);
        }}
      >
        ランダム
      </button>
    </div>
  );
};

export default Monitor;
