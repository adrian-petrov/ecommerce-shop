import React from 'react';
/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
export const createCtx = <A,>(defaultValue: A) => {
  type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>;

  const defaultUpdate: UpdateType = () => defaultValue;

  const ctx = React.createContext({
    state: defaultValue,
    update: defaultUpdate,
  });

  const Provider = (props: React.PropsWithChildren<{}>) => {
    const [state, update] = React.useState(defaultValue);
    return <ctx.Provider value={{ state, update }} {...props} />;
  };
  return [ctx, Provider] as const;
};
