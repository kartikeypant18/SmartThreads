import React, { useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { FaRobot } from "react-icons/fa";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton
        aria-label="Chat with us"
        icon={<FaRobot size={45} />}
        position="fixed"
        bottom="20px"
        right="20px"
        width={isOpen ? "80px" : "70px"}
        height={isOpen ? "80px" : "70px"}
        backgroundColor="black"
        color="white"
        borderRadius="full"
        onClick={toggleChat}
        zIndex={1001}
        transition="transform 0.3s, width 0.3s, height 0.3s"
        transform={isOpen ? "scale(1.1)" : "scale(1)"}
        _hover={{
          backgroundColor: "black",
          color: "grey",
          transform: "scale(1.2)",
          width: "80px",
          height: "80px",
        }}
      />
      {isOpen && (
        <Box
          as="iframe"
          src="https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=2034f9fc-efce-465b-bfbb-a7432b5a1538"
          position="fixed"
          bottom="80px"
          right="20px"
          width="350px"
          height="500px"
          border="none"
          zIndex={1000}
          allow="microphone; camera"
          title="Botpress Webchat"
        />
      )}
    </>
  );
};

export default ChatButton;
