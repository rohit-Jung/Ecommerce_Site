import { getCurrentUser } from "@/actions/getCurrentUser";
import {
  AddProductForm,
  Container,
  FormWrap,
  NullData,
} from "@/app/Components";
import React from "react";

const AddProducts = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied" />;
  }

  return (
    <div className="p-8">
      <Container>
        <FormWrap>
          <AddProductForm />
        </FormWrap>
      </Container>
    </div>
  );
};

export default AddProducts;
