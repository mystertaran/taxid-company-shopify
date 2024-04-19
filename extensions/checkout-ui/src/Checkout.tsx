import { useState, useEffect } from "react";

import {
  TextField,
  BlockStack,
  Checkbox,
  reactExtension,
  useApplyMetafieldsChange,
  useMetafield,
  useApi,
  useTranslate
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.delivery-address.render-after",
  () => <Extension />
);

function Extension() {
  const [checked, setChecked] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const metafieldNamespace = "customer";
  const taxIdKey = "taxid";
  const companyNameKey = "companyName";
  const { i18n } = useApi();
  const translate = useTranslate();

  const customerTaxId = useMetafield({
    namespace: metafieldNamespace,
    key: taxIdKey,
  });

  const customerCompanyName = useMetafield({
    namespace: metafieldNamespace,
    key: companyNameKey,
  });

  useEffect(() => {
    if (customerTaxId && customerTaxId.value) {
      setTaxId(customerTaxId.value as string);
    }
    if (customerCompanyName && customerCompanyName.value) {
      setCompanyName(customerCompanyName.value as string);
    }
  }, [customerTaxId, customerCompanyName]);

  const applyMetafieldsChange = useApplyMetafieldsChange();

  const handleTaxIdChange = (value: string) => {
    setTaxId(value);
    if (checked && value !== "") {
      applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: taxIdKey,
        valueType: "string",
        value,
      });
    }
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    if (checked && value !== "") {
      applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: companyNameKey,
        valueType: "string",
        value,
      });
    }
  };

  const handleCheckboxChange = (value: boolean) => {
    setChecked(!checked);
  };


  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleCheckboxChange}>
        {translate('invoiceCheckbox')}
      </Checkbox>
      {checked && (
        <BlockStack>
          <TextField
            label={translate('companyName')}
            name="companyName"
            value={companyName}
            onChange={handleCompanyNameChange}
          />
          <TextField
            label={translate('taxId')}
            name="taxId"
            value={taxId}
            onChange={handleTaxIdChange}
          />
        </BlockStack>
      )}
    </BlockStack>
  );
}
