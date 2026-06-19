import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

function PromptTextBlock({ prompt }) {
  const [copied, setCopied] = useState(false);

  // Convert the prompt object to markdown-style readable text
  const formatPromptAsMarkdown = (data) => {
    if (!data) return "No prompt data available.";
    
    // If it's already a string, return it
    if (typeof data === "string") return data;
    
    // If it's an object, format it nicely
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return `**${key}:**\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n`;
      }
      return `**${key}:** ${value}\n`;
    }).join("\n");
  };

  const formattedContent = formatPromptAsMarkdown(prompt?.prompt);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
        <IconButton
          onClick={handleCopy}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
            zIndex: 1,
          }}
          size="small"
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      
      <Box
        sx={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          fontFamily: "monospace",
          fontSize: "0.875rem",
        //   backgroundColor: "#221d1d85",
          color: "#fff",
          padding: 2,
          borderRadius: 1,
          maxHeight: "600px",
          overflowY: "auto",
          "& strong": {
            color: "#4fc3f7",
            fontWeight: 600,
          },
        }}
      >
        {formattedContent}
      </Box>
    </Box>
  );
}

export default PromptTextBlock;
