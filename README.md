import Resolver from "@forge/resolver";
import api, { route } from "@forge/api"; 
import { kvs } from '@forge/kvs';
const resolver = new Resolver();

resolver.define('setTicket', async(payload)=>{
  const pay = payload.payload;
  const accountId = pay.accountId;
  const gadgetId = pay.gadgetId;
  const ticket = pay.ticket;
  
 
  const current = await kvs.getSecret(gadgetId) || {};
  console.log("curren",current);
  
  current[accountId]=ticket;
  await kvs.setSecret(gadgetId, current);
})

resolver.define('getTicket', async(payload)=>{
  const pay = payload.payload;
  const accountId = pay.accountId;
  const gadgetId = pay.gadgetId;

  const current = await kvs.getSecret(gadgetId);
  console.log("current",current);
  
  return current?.[accountId] || null;
})

resolver.define("getProjects", async () => {
  try {
    const response = await api
      .asUser()
      .requestJira(route`/rest/api/3/project/search`, {
        headers: {
          Accept: "application/json",
        },
      });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json(); 
    
    return data.values;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { values: [] }; 
  }
});

export const handler = resolver.getDefinitions();




import React, { useEffect, useState } from "react";
import Form, { Field, HelperMessage, ErrorMessage } from "@atlaskit/form";
import { invoke, Modal, view,events } from "@forge/bridge";
import TextField from "@atlaskit/textfield";
import Button from "@atlaskit/button";
import Select from "@atlaskit/select";
import { buttonStyles } from "./Styles";
import { IconButton } from "@atlaskit/button/new";
import EditIcon from "@atlaskit/icon/core/edit";
import { fetchReports, logout } from "./api";

function Edit() {
  const [baseUrl, setBaseUrl] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [defaultConfigurations, setDefaultConfigurations] = useState({
    baseUrl: "",
    report: { label: "", value: "" },
    project: { label: "", value: "" },
    height: "",
  });
  const [fieldDisabled, setFieldDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportError, setReportError] = useState(null);

  useEffect(()=>{
    view.getContext().then((context) => {
      console.log("gadid",context.extension.gadget.id);
      console.log("accid",context.accountId);
    });
    
  },[])
  useEffect(() => {
    const subscription = events.on('JIRA_DASHBOARD_GADGET_REFRESH', async() => {
      if(baseUrl && authToken)
      {
        await getProjectList();
        await getReportList(baseUrl,authToken);
      }
    });

    return () => {
      subscription.then(({ unsubscribe }) => unsubscribe());
    };
  }, [baseUrl,authToken]);

  const setDefaultValues = async () => {
    const context = await view.getContext();

    const storedBaseUrl = context.extension.gadgetConfiguration?.baseUrl;
    const storedReport = context.extension.gadgetConfiguration?.report;
    const storedProject = context.extension.gadgetConfiguration?.project;
    const storedHeight = context.extension.gadgetConfiguration?.height;

    const defaultReport =
      storedReport &&
      reportOptions.some((option) =>
        option.options.some((report) => report.value === storedReport.value)
      )
        ? { label: storedReport.label, value: storedReport.value }
        : null;

    const defaultProject =
      storedProject &&
      projectOptions.some((project) => project.value === storedProject)
        ? { label: storedProject, value: storedProject }
        : null;

    setDefaultConfigurations({
      baseUrl: storedBaseUrl || "",
      report: defaultReport,
      project: defaultProject,
      height: storedHeight || "500",
    });
  };

  useEffect(() => {
    setDefaultValues();
  }, [reportOptions, projectOptions]);

  const getProjectList = async () => {
    const projectList = await invoke("getProjects");

    const options = projectList.map((project) => ({
      value: project.name,
      label: project.name,
    }));
    setProjectOptions(options);
  };

  const getReportList = async (baseUrl, authToken) => {
    try {

      const data = await fetchReports(baseUrl,authToken);

      const reports = data.reportList.report.sort((a, b) =>
        a.entityName.localeCompare(b.entityName)
      );
      setReports(reports);
      const options = [
        {
          label: "Reports",
          options: reports
            .filter((report) => report.reportType === "Report")
            .map((report) => ({
              value: report.id,
              label: report.entityName,
            })),
        },
        {
          label: "Snapshots",
          options: reports
            .filter((report) => report.reportType === "Snapshot")
            .map((report) => ({
              value: report.id,
              label: report.entityName,
            })),
        },
      ];
      setReportError(null);
      setReportOptions(options);
    } catch (error) {
      setReportError("Could not fetch reports. Please try again");
      setReportOptions([]);
      setReports([]);
    }
  };

  useEffect(() => {
    const fetchContext = async () => {
      const context = await view.getContext();
      
      
      const contextTicket = context.extension.gadgetConfiguration?.ticket;
      const contextBaseUrl = context.extension.gadgetConfiguration?.baseUrl;

      if (contextTicket && contextBaseUrl) {
        getReportList(contextBaseUrl, contextTicket);
        getProjectList();
        setAuthToken(contextTicket);
        setButtonDisabled(true);
        setFieldDisabled(true);
        setBaseUrl(contextBaseUrl);
      }
    };

    fetchContext();
  }, []);

  const handleLogin = async (formData) => {
    const { inputUrl } = formData;

    if (baseUrl === inputUrl && authToken && !reportError) {
      setFieldDisabled(true);
      setButtonDisabled(true);
      return;
    }

    const modal = new Modal({
      resource: "modal",
      onClose: async (ticket) => {
        if (ticket) {
          const ctx = await view.getContext();
          const accountId = ctx.accountId;
          const gadgetId = ctx.extension.gadget.id;
          const payload ={accountId:accountId, gadgetId:gadgetId, ticket:ticket};
          await invoke('setTicket',payload);
          const pay = {accountId:accountId,gadgetId:gadgetId}
          const tic = await invoke('getTicket',pay);
          console.log("tic",tic);
          
          try {
            if (authToken && baseUrl) {
              await logout(baseUrl, authToken);
            }

            setAuthToken(ticket);
            setFieldDisabled(true);
            setButtonDisabled(true);
            await getReportList(inputUrl, ticket);
            await getProjectList();
            setBaseUrl(inputUrl);
          } catch (error) {
            console.error("Error logging out previous session");
          }
        }
      },
      size: "max",
      context: { baseUrl: inputUrl },
    });
    modal.open();
  };

  const saveConfigurations = async (formData) => {
    const { report, project, height } = formData;

    const reportID = report.value;
    const matchingReport = reports.find((r) => r.id === reportID);
    let reportType = matchingReport.reportType;

    let projectValue = "";

    if (project && project.value) {
      projectValue = project.value;
    }
    view.submit({
      baseUrl: baseUrl,
      ticket: authToken,
      height: height,
      report: report,
      reportType: reportType,
      project: projectValue,
    });
  };

  const handleEditClick = () => {
    setFieldDisabled(false);
    setButtonDisabled(false);
  };

  return (
    <>
      <Form onSubmit={handleLogin}>
        {({ formProps, submitting }) => (
          <form {...formProps}>
            <Field
              name="inputUrl"
              label="eQube-BI URL"
              isRequired
              defaultValue={defaultConfigurations.baseUrl}
            >
              {({ fieldProps }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    {...fieldProps}
                    isDisabled={fieldDisabled && authToken}
                  />
                  {fieldDisabled && authToken && (
                    <IconButton
                      icon={EditIcon}
                      label="Edit"
                      onClick={handleEditClick}
                    />
                  )}
                </div>
              )}
            </Field>
            <HelperMessage>eQube-BI Context URL</HelperMessage>
            {!buttonDisabled && (
              <Button
                type="submit"
                isDisabled={submitting}
                style={buttonStyles}
              >
                Login
              </Button>
            )}
          </form>
        )}
      </Form>

      {authToken && (
        <Form onSubmit={saveConfigurations}>
          {({ formProps, submitting }) => (
            <form {...formProps}>
              <Field
                name="report"
                label="Report Name"
                isRequired
                defaultValue={defaultConfigurations.report }
                validate={(value)=>(!value) && "Please select a report"}
              >
                {({ fieldProps, error }) => (
                  <>
                  <Select
                    {...fieldProps}
                    options={reportOptions}
                    placeholder="Select Report"
                  />
                  {error && (
                    <ErrorMessage>{error}</ErrorMessage>
                  )}
                  </>
                )}
              </Field>
              <HelperMessage>eQube-BI Report Name</HelperMessage>
              
              {reportError && <ErrorMessage>{reportError}</ErrorMessage>}
              <Field
                name="project"
                label="Project"
                defaultValue={defaultConfigurations.project}
              >
                {({ fieldProps }) => (
                  <Select
                    isClearable
                    {...fieldProps}
                    options={projectOptions}
                    placeholder="Select Project"
                  />
                )}
              </Field>
              <HelperMessage>
                Applies selected Jira project as a filter on the selected
                eQube-BI dashboard.
              </HelperMessage>

              <Field
                name="height"
                label="Height"
                isRequired
                defaultValue={defaultConfigurations.height}
              >
                {({ fieldProps }) => (
                  <TextField
                    {...fieldProps}
                    type="number"
                    placeholder="Report Container Height"
                  />
                )}
              </Field>
              <HelperMessage>Report Container Height</HelperMessage>

              <Button
                type="submit"
                isDisabled={submitting}
                style={buttonStyles}
              >
                Save
              </Button>
            </form>
          )}
        </Form>
      )}
    </>
  );
}

export default Edit;






import React, { useEffect, useState } from "react";
import { view,invoke } from "@forge/bridge";

function View() {
  
  const [reportUrl, setReportUrl] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    view.getContext().then(async(context) => {
      console.log("context in view",context);
      
      let baseUrl = context.extension.gadgetConfiguration.baseUrl;
      const ticket = context.extension.gadgetConfiguration.ticket;
      const height = context.extension.gadgetConfiguration.height;

      const reportID = encodeURIComponent(
        context.extension.gadgetConfiguration.report.value
      );
      const reportType = encodeURIComponent(
        context.extension.gadgetConfiguration.reportType
      );
      const project = encodeURIComponent(
        context.extension.gadgetConfiguration.project
      );

      let url = `${baseUrl}/integration?reportId=${reportID}&reportType=${reportType}`;

      if (project) {
        url += `&filters=FilterFVE_1&FilterFVE_1_column=Project&FilterFVE_1_operator==&FilterFVE_1_values=${project}`;
      }

      
      const accountId = context.accountId;
      const gadgetId = context.extension.gadget.id;
      //const payload ={accountId:accountId, gadgetId:gadgetId, ticket:ticket};
      //await invoke('setTicket',payload);
      const pay = {accountId:accountId,gadgetId:gadgetId}
      console.log("pay",pay);
      
      const tic = await invoke('getTicket',pay);
      if(tic === ticket)
      {
        url += `&ticket=${ticket}`;
      }
      else
      {
        const modal = new Modal({
            resource: "modal",
            onClose: async (ticket) => {
              if (ticket) {
                url+=ticket;
              }
            },
            size: "max",
            context: { baseUrl: baseUrl, fromView:true },
          });
          modal.open();
      }

      setHeight(height);
      setReportUrl(url);
      console.log("url",url);
      
    });
  }, []);

  return (
    <div>
      {reportUrl && height && (
        <>
          <iframe
            src={reportUrl}
            width="100%"
            height={`${height}px`}
            title="Generated View"
          ></iframe>
        </>
      )}
    </div>
  );
}

export default View;



modules:
  jira:dashboardGadget:
    - key: equbebi-dashboard-gadget
      title: eQube-BI Dashboard
      description: eQube-BI Dashboard gadget.
      thumbnail: https://www.1eq.com/html/version10/eQCommunity/icons/eQube_BI_black.svg
      resource: main-app
      resolver:
        function: resolver
      edit:
        resource: main-app
      refreshable: false
  function:
    - key: resolver
      handler: index.handler
resources:
  - key: modal
    path: static/modal-app/build
    tunnel:
      port: 3001
  - key: main-app
    path: static/main-app/build
    tunnel:
      port: 3000
permissions:
  content:
    styles:
      - unsafe-inline
    scripts:
      - 'unsafe-inline'
  scopes:
    - read:jira-work
    - storage:app
  external:
    frames:
      - '*'
    fetch:
      client:
        - '*'  
    
app:
  runtime:
    name: nodejs22.x
  id: ari:cloud:ecosystem::app/8c3bbde2-f0d3-4ecb-b8ff-2b60a0e1b8a3


