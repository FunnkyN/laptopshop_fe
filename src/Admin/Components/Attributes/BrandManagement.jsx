import React from "react";
import AttributeManagement from "./AttributeManagement";

const BrandManagement = () => {

  return (
    <AttributeManagement
        title="Quản lý Thương hiệu / Hãng (GPU, CPU, Laptop)"
        endpoint="brands"
        fieldName="name"
    />
  );
};

export default BrandManagement;