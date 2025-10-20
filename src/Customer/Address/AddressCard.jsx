import React from "react";

const AddressCard = ({ address }) => {
  return (
    <div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Người nhận:</p>
          <span>{address?.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Địa chỉ:</p>
          <span>{`${address?.streetAddress}, ${address?.city}`}</span>
        </div>

        <div className="flex items-center space-x-2">
          <p className="font-semibold">Số điện thoại:</p>
          <span>{address?.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;

