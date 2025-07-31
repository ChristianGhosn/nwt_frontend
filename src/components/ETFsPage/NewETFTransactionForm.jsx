import Button from "../Button";
import Input from "../Input";

const NewETFTransactionForm = ({
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
        label="Ticker"
        name="ticker"
        value={formData.ticker}
        onChange={handleChange}
        error={errors.ticker}
      />
      <Input
        type="date"
        label="Order Date"
        name="orderDate"
        value={formData.orderDate}
        onChange={handleChange}
        error={errors.orderDate}
      />
      <Input
        type="number"
        label="Units"
        name="units"
        value={formData.units}
        onChange={handleChange}
        error={errors.units}
      />
      <Input
        type="number"
        label="Order Price"
        name="orderPrice"
        value={formData.orderPrice}
        onChange={handleChange}
        error={errors.orderPrice}
      />
      <Input
        type="number"
        label="Brokerage Fee"
        name="brokerage"
        value={formData.brokerage}
        onChange={handleChange}
        error={errors.brokerage}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Transaction</Button>
      </div>
    </form>
  );
};

export default NewETFTransactionForm;
