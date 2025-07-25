import Button from "../Button";
import Input from "../Input";

const NewTickerForm = ({
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
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Ticker</Button>
      </div>
    </form>
  );
};

export default NewTickerForm;
