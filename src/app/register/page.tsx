import React from "react";
import { Container, FormWrap, RegisterForm } from "../Components";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Register = async () => {
  const currentUser = await getCurrentUser();
  return (
    <Container>
      <FormWrap>
        <RegisterForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

export default Register;
