import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  variant?: "regular" | "large";
  children?: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => (
  <Box
    maxW={variant === "regular" ? "400px" : "800px"}
    w="100%"
    mt={8}
    mx="auto"
  >
    {children}
  </Box>
);
