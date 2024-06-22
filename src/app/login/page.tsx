import React from "react";
import { Container, FormWrap } from "@/components";
import LoginForm from "@/components/Form/LoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Login = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <Container>
        <FormWrap>
          <LoginForm currentUser={currentUser} />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Login;
