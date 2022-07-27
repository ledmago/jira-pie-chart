import React from "react";
import Form, { Field } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import { view } from "@forge/bridge";
import Select from "@atlaskit/select";

function Configration({ setSelectedProject, projects }) {
  const onSubmit = (formData) => {
    view.submit(formData);
  };
  return (
    <Form onSubmit={onSubmit}>
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Field name="project" label="Projects">
            {({ fieldProps }) => (
              <Select
                inputId="single-select-example"
                className="single-select"
                classNamePrefix="react-select"
                options={projects.map((e) => ({
                  value: e.name,
                  label: e.name,
                }))}
                placeholder="Choose a project"
                {...fieldProps}
              />
            )}
          </Field>
          <br />
          <ButtonGroup>
            <Button type="submit" isDisabled={submitting}>
              Save
            </Button>
            <Button appearance="subtle" onClick={view.close}>
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      )}
    </Form>
  );
}

export default Configration;
