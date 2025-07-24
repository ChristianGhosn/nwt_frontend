import { currencies } from "../../constants/currencies";
import Button from "../Button";
import Input from "../Input";

const NewAccountForm = ({
  formData,
  errors,
  handleSubmit,
  handleChange,
  handleCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Input
        autofocus={true}
        type="text"
        label="Bank"
        name="bank"
        value={formData.bank}
        onChange={handleChange}
        error={errors.bank}
      />
      <Input
        type="number"
        label="Balance"
        name="balance"
        value={formData.balance}
        onChange={handleChange}
        error={errors.balance}
      />
      <Input
        type="select"
        label="Currency"
        name="currency"
        value={formData.currency}
        onChange={handleChange}
        options={currencies}
        error={errors.currency}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Bank</Button>
      </div>
    </form>
  );
};

export default NewAccountForm;
