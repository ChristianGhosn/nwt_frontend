import React from "react";
import InputField from "../components/Input";
import { useAuth0 } from "@auth0/auth0-react";

const Settings = () => {
  const { user } = useAuth0();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">General</h2>
          <div className="space-y-4">
            <InputField
              label="Email"
              type="email"
              name="email"
              disabled={true}
              value={user?.email}
            />
            <InputField
              label="Day of Month Paid"
              description="What day of the month are you paid? If you're not paid monthly, set this to 1"
              type="number"
              name="payday"
            />
            <InputField
              label="Employment Salary"
              description="What is your yearly salary? (Pre-tax)"
              type="number"
              name="salary"
            />
            <InputField
              label="Net Regular Income"
              description="What hits your bank each payday? (Post-tax)"
              type="number"
              name="income"
            />
            <InputField
              label="Salary Frequency"
              type="select"
              name="salaryFreq"
              options={[
                { id: 0, name: "Monthly" },
                { id: 1, name: "Twice Monthly" },
                { id: 2, name: "4 weeks" },
                { id: 3, name: "Fortnightly" },
                { id: 4, name: "Weekly" },
              ]}
            />
            <InputField
              label="Currency Choice"
              type="select"
              name="currencyChoice"
              options={[
                { id: 0, name: "AUD" },
                { id: 1, name: "USD" },
              ]}
            />
            <InputField label="Tax Bracket" name="taxBracket" type="number" />
            <InputField
              label="Capital Gains - Calculation Style"
              name="capitalGainsCalculationStyle"
              type="select"
              options={[{ id: 0, name: "FIFO" }]}
            />
            <InputField
              label="Capital Gains - Short Term Tax Rate"
              name="capitalGainsShortTermTaxRate"
              type="number"
            />
            <InputField
              label="Capital Gains - Long Term Tax Rate"
              name="capitalGainsLongTermTaxRate"
              type="number"
            />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Investments</h2>
          <div className="space-y-4">
            <InputField
              label="Bank Interest Rate"
              description="The interest rate your bank provides on your savings (p.a)"
              type="number"
              name="bankInterestRate"
            />
            <InputField
              label="Brokerage"
              description="How much you pay for brokerage"
              type="number"
              name="brokerage"
            />
            <InputField
              label="Crypto Fee"
              description="The fee in percent that your exchange charges per buy/sell transaction"
              type="number"
              name="cryptoFee"
            />
            <InputField
              label="Allocation Aggressiveness"
              description="How aggressively do you want to keep aligning with your Asset Allocations? Investing involves risk, make an educated decision (see Disclaimer)."
              type="select"
              name="allocationAggressiveness"
              options={[
                { id: 0, name: "Light" },
                { id: 1, name: "Normal" },
                { id: 2, name: "Aggressive" },
              ]}
            />
            <InputField
              label="Asset Allocations - ETFs"
              description="How much of your assets (excluding property) do you want in ETFs? Investing involves risk, make an educated decision (see Disclaimer)."
              type="number"
              name="assetAllocationEtfs"
            />
            <InputField
              label="Asset Allocations - Stocks"
              description="How much of your assets (excluding property) do you want in Stocks? Investing involves risk, make an educated decision (see Disclaimer)."
              type="number"
              name="assetAllocationStocks"
            />
            <InputField
              label="Asset Allocations - Crypto"
              description="How much of your assets (excluding property) do you want in Crypto? Investing involves risk, make an educated decision (see Disclaimer)."
              type="number"
              name="assetAllocationCrypto"
            />
            <InputField
              label="Asset Allocations - Cash Savings"
              description="How much of your assets (excluding property) do you want in Cash Savings? Investing involves risk, make an educated decision (see Disclaimer)."
              type="number"
              name="assetAllocationCashSavings"
            />
          </div>
        </div>
        <div className="lg:col-span-2 xl:col-span-1 p-4">
          <h2 className="text-xl font-semibold mb-2">Cash</h2>
          <div className="space-y-4">
            <InputField
              label="House Price Target"
              description="Are you saving for a house? Put in a rough value"
              type="number"
              name="housePriceTarget"
            />
            <InputField
              label="General Cash Savings Target"
              description="Set yourself an open-ended Cash goal."
              type="number"
              name="savingsTarget"
            />
            <InputField
              label="EOY Cash Goal"
              description="How much cash savings would you like to aim for at the end of the year?"
              type="number"
              name="eoyCashGoal"
            />
            <InputField
              label="House Deposit - % Target"
              description="(If Applicable) Of your House Price target, how big in % does your House Deposit need to be?"
              type="number"
              name="houseDepositPercentTarget"
            />
            <InputField
              label="House Despoit - Investment Contribution %"
              description="(If Applicable) How much of your investments will you be using for your House Deposit?"
              type="number"
              name="houseDepositInvestmentContributionPercent"
            />
            <InputField
              label="Include Mortgage in Savings Rate?"
              description="Set to yes if you want your monthly mortgage repayment included in your Savings rate figure. Otherwise it will show as a 'Spend'"
              type="select"
              name="mortgageInSavingsRate"
              options={[
                { id: 0, name: "No" },
                { id: 0, name: "Yes" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
