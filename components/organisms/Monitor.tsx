import React, { useEffect, useState } from "react";
import ConnectButton from "@/components/atoms/ConnectButton";
import Stream from "@/components/atoms/Stream";
import ChannelMenu from "@/components/moleculars/ChannelMenu";

const Monitor = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [port, setPort] = useState<SerialPort>();

  const [serialData, setSerialData] = useState<any[]>([]);
  const [serialDataset, setSerialDataset] = useState<any[][]>([]);

  const [visibleChannels, setVisibleChannels] = useState<boolean[]>([]);

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

  useEffect(() => {
    console.log(visibleChannels)
  }, [visibleChannels])

  return (
    <div className="p-5">
      <div className="mb-1">
        {isSupported && (
          <div className="text-sm">Web Serial API is Supported.</div>
        )}
      </div>
      <div className="flex">
      <ConnectButton onClick={ConnectClicked}>Connect</ConnectButton>
        <div className="mx-1"></div>
      <ChannelMenu setVisibleChannels={setVisibleChannels}/>

      </div>
      <Stream data={serialDataset} visibleChannels={visibleChannels} />
    </div>
  );
};

export default Monitor;
