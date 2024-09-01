import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    // Example password validation
    const minLength = 8;
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    // Additional validation can be added here (e.g., regex for complexity)
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // Validate password strength
    const validationError = validatePassword(password);
    if (validationError) {
      toast({
        title: "Invalid Password",
        description: validationError,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        description: "Please make sure both passwords are the same.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/change-password",
        { newPassword: password, token }
      );

      if (response.data.success) {
        toast({
          title: "Password updated.",
          description: "Your password has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast({
          title: "Error.",
          description: response.data.message || "Failed to update password.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error.",
        description: "An error occurred. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        style={{ width: "441px" }}
      >
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Create New Password
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack>
            <form onSubmit={handleSubmit}>
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <FormControl id="confirmPassword" mb={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                style={{ marginTop: "1rem" }}
                isLoading={isLoading}
                loadingText="Submitting"
              >
                Submit
              </Button>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
