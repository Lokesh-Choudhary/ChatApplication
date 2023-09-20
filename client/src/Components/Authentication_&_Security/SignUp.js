import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const history = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      showToast("Warning", "Please select an image", "warning");
      return;
    }

    if (!selectedImage.type.match(/image\/(jpeg|png)/)) {
      showToast("Warning", "Please select a valid image (JPEG or PNG)", "warning");
      return;
    }

    uploadImage(selectedImage);
  };

  const uploadImage = async (image) => {
    try {
      setPicLoading(true);

      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Chat-Lokesh");
      data.append("cloud_name", "roadlokesh");

      const response = await fetch("https://api.cloudinary.com/v1_1/roadlokesh/image/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const responseData = await response.json();
      setPic(responseData.url.toString());
      setPicLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Error Occurred", "Image upload failed", "error");
      setPicLoading(false);
    }
  };

  const validateAndSubmit = async () => {
    setPicLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      showToast("Warning", "Please fill in all fields", "warning");
      setPicLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showToast("Warning", "Passwords do not match", "warning");
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      showToast("Success", "Registration successful", "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history("/chats");
    } catch (error) {
      console.error("Error during registration:", error);
      showToast("Error Occurred", error.response?.data?.message || "An error occurred", "error");
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={validateAndSubmit}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
