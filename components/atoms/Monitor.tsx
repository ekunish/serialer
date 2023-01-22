import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
// import Graph from "./Graph";
import Stream from "./Stream";

type data = {
  time: number;
  red: number;
  ir: number;
};

const Monitor = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [port, setPort] = useState<SerialPort>();

  const [serialData, setSerialData] = useState<any[]>([]);

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
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                console.log("Canceled");
                break;
              }
              const v = value.split("\t");

              setSerialData([...serialData, [v]]);

              // if (v.length === 3) {
              //   const time = Number(v[0]);
              //   const red = Number(v[1]);
              //   const ir = Number(v[2]);

              //   const d: data = { time, red, ir };
              //   setDat(d);
              // }
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
    serialData[0] && console.log(serialData);
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
      <ConnectButton onClick={ConnectClicked}>Connect</ConnectButton>
      {/* <div>{dat && dat.time}</div> */}
      {/* <Graph dat={dat} /> */}
      <Stream time={time} data={data} />
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
