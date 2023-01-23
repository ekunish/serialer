import React, { useEffect, useState } from "react";
import ConnectButton from "@/components/atoms/ConnectButton";
import Stream from "@/components/atoms/Stream";
import ChannelMenu from "@/components/moleculars/ChannelMenu";
import SaveButton from "@/components/atoms/SaveButton";

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

  const SaveClicked = async () => {
    ExportCSV(serialDataset, getDateTime());
    ClearDataset();
  };

  const ExportCSV = async (records: any[][], name: string) => {
    let data = records.map((record) => record.join(",")).join("\r\n");

    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    let blob = new Blob([bom, data], { type: "text/csv" });
    let url = (window.URL || window.webkitURL).createObjectURL(blob);
    let link = document.createElement("a");
    link.download = name + ".csv"
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}${month}${day}${hour}${minute}${second}`;
  };

  const ClearDataset = () => {
    setSerialDataset([]);
  };

  return (
    <div className="p-5">
      <div>
        <h1 className="text-2xl">Web Serial API Monitor</h1>
      </div>
      <div className="mb-1">
        {isSupported && (
          <div className="text-sm">Web Serial API is Supported.</div>
        )}
      </div>
      <div className="flex">
        <ConnectButton onClick={ConnectClicked}>Connect</ConnectButton>
        <div className="mx-1"></div>
        <ChannelMenu setVisibleChannels={setVisibleChannels} />
        <div className="mx-10"></div>
        <SaveButton onClick={SaveClicked}>Save</SaveButton>
      </div>
      <Stream data={serialDataset} visibleChannels={visibleChannels} />
    </div>
  );
};

export default Monitor;
