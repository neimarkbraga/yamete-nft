import React, { useState, FormEvent, useEffect } from 'react';
import { providers, Contract, utils as etherUtils } from 'ethers';
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import { ExternalProvider } from '@ethersproject/providers';

interface FunctionInput {
  name: string
  type: 'string' | 'number' | 'bytes'
  required?: boolean
  readonly?: boolean
  value: string
}

interface ContractFunctionFormProps {
  abi: any
  address: string
  method: string
  fields: FunctionInput[],
  onSuccess: (response: unknown) => void
}

const ContractFunctionForm = (props: ContractFunctionFormProps) => {
  const { abi, address, method, fields, onSuccess } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [valueMap, setValueMap] = useState<Map<FunctionInput,string>>(new Map());

  const reset = () => {
    const _valueMap = new Map<FunctionInput,string>();
    for (const field of fields)
      _valueMap.set(field, field.value);
    setValueMap(_valueMap);
  };

  const setFieldValue = (field: FunctionInput, value: string) => {
    const _valueMap = new Map<FunctionInput,string>();
    for (const field of fields)
      _valueMap.set(field, valueMap.get(field) || '');
    _valueMap.set(field, value);
    setValueMap(_valueMap);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage('');

      const provider = new providers.Web3Provider(window.ethereum as ExternalProvider);
      const contract = new Contract(address, abi, provider.getSigner());
      const values = fields.filter(field => field.required || valueMap.get(field)).map(field => {
        const value = valueMap.get(field) || '';
        if (field.type === 'number')
          return Number(value);
        if (field.type === 'bytes')
          return etherUtils.arrayify(value);
        return value;
      });

      // due to overload functions
      // a function getter is needed
      const func: (...args: any) => Promise<unknown> = (() => {
        const keys = Object.keys(contract);
        for (const key of keys) {
          if (key === method)
            return contract[key];
        }

        for (const key of keys) {
          const matches = /([^(]+)\((.*)\)/.exec(key);
          if (matches) {
            const name = matches[1].trim();
            const args = matches[2].trim().split(',');
            if (name === method && values.length === args.length)
              return contract[key];
          }
        }

        throw new Error('method is not supported.');
      })();

      onSuccess(await func(...values));
      reset();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(reset, [fields]);

  return (
    <form onSubmit={submit}>
      <fieldset disabled={isLoading} style={{border: 'none', padding: 0}}>
        {fields.map((field, index) => (
          <Box pb={2} key={index}>
            <TextField
              label={field.name}
              required={field.required}
              disabled={field.readonly}
              value={valueMap.get(field) || ''}
              onChange={e => setFieldValue(field, e.target.value)}
              size="small"
              fullWidth
            />
          </Box>
        ))}

        {!!errorMessage && (
          <Box pb={2}>
            <Alert onClose={() => setErrorMessage('')} severity="error">{errorMessage}</Alert>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={15} color="inherit" />}
            type="submit"
            variant="contained"
            size="small"
          >
            Transact
          </Button>
        </Box>
      </fieldset>
    </form>
  );
};

export default ContractFunctionForm;
