import { Box, Button, Card, Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

type WizardFormProps = {
  children: React.ReactNode;
  handleFormSubmit: () => void;
  formMethods: UseFormReturn;
};

const WizardForm = ({
  children,
  handleFormSubmit,
  formMethods,
}: WizardFormProps) => {
  const steps = React.Children.toArray(
    children,
  ) as React.ReactElement<WizardFormStepProps>[];
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeStepFormValues, setActiveStepFormValues] = React.useState<
    string[]
  >([]);
  const step = steps[activeStep];
  const totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;

  const {
    formState: { isSubmitting, errors },
    trigger,
  } = formMethods;

  // a form step might contain several form values instead of just one
  // e.g. ['colour', 'gender'] vs. 'productId'
  const getStepFormValues = () => {
    const { formValue } = step.props;

    if (Array.isArray(formValue)) {
      setActiveStepFormValues([...formValue]);
      return;
    }
    setActiveStepFormValues([formValue]);
  };

  React.useEffect(() => {
    getStepFormValues();
  }, [step.props.formValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLastStep) {
      return handleFormSubmit();
    }
    handleNext();
  };

  const handleNext = async (): Promise<void> => {
    const valid = await trigger(activeStepFormValues, {
      shouldFocus: true,
    });
    if (!valid) return;

    setActiveStep(Math.min(activeStep + 1, totalSteps - 1));
  };

  const handlePrevious = (): void => {
    setActiveStep(Math.max(activeStep - 1, 0));
  };

  return (
    <Card
      sx={{
        padding: 3,
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((s) => (
          <Step key={s.props.label}>
            <StepLabel>{s.props.label.toUpperCase()}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit}>
          {step}
          {/* FOOTER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              sx={{ marginRight: 2 }}
              disabled={activeStep === 0}
              onClick={handlePrevious}
            >
              Back
            </Button>
            <Button
              disabled={isSubmitting || Object.keys(errors).length > 0}
              variant="contained"
              color="primary"
              type="submit"
            >
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Card>
  );
};

type WizardFormStepProps = {
  children: React.ReactNode;
  label: string;
  formValue: string | string[];
};

export const WizardFormStep = ({ children }: WizardFormStepProps) => {
  return (
    <Box
      sx={{
        marginTop: 2,
        width: '50%',
      }}
    >
      {children}
    </Box>
  );
};

export default WizardForm;
