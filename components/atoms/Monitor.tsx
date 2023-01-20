import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";

const Monitor = () => {
  useEffect(() => {
    if ("serial" in navigator) {
      console.log("Awesome, The serial port is supported.");
      // The Web Serial API is supported.
    }
  }, []);

  const ConnectClicked = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    console.log(port);

    while (port.readable) {
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          if (value) {
            console.log(value);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div>Monitor</div>
      <button onClick={ConnectClicked}>Click me</button>
    </div>
  );
};

export default Monitor;
