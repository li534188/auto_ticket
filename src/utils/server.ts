import { post, get } from './httpUtils';
import { message } from 'ant-design-vue';
import { LoadingModule } from '@/store/modules/loading';


export async function createHrIssue(data: { issueNumber: number }) {
  const res = await post('/api/template_list', data);
  if (res.statue === 'ok')
    return res.data;
  else
    message.error('Serve Error');
}

export async function searchTemplate(data: { jobTitle: string; company: string; manager: string }) {
  const res = await post('/api/search-template', data);
  return res;
}

export async function getCompanyList() {
  const res = await get('/api/list-company');
  return res;
}


export async function getManagerList() {
  const res = await get('/api/list-manager');
  return res;
}

export async function checkDuplicate(data: { jobTitle: string; manager: string; templateId: string }) {
  const res = await post('/api/check-duplicate', data);
  return res;
}


export async function createTemplate(data: { jobTitle: string; manager: string; company: string; phase: string[]; access: string[]; sop: string[]; office?: string; creator: string|null}) {
  const res = await post('/api/create-template', data);
  return res;
}

export async function deleteTemplate(data: {templateId: string}) {
  const res = await post('/api/delete-template', data);
  return res;
}


export async function getAccessList() {
  const res = await get('/api/get-access-list');
  return res;
}

export async function getSop() {
  const res = await get('/api/get-sop-list');
  return res;
}

export async function getSopList() {
  const res = await get('/api/sop-with-phase');
  return res;
}

export async function getTemplateInfo(data: { templateId: string }) {
  LoadingModule.asyncChangeStatus(true);
  const res = await post('/api/get-template-info', data);
  LoadingModule.asyncChangeStatus(false);
  return res;
}

export async function updateTeplate(data: {
                                            templateId: string;
                                            manager: string;
                                            office?: string;
                                            company: string;
                                            jobTitle: string;
                                            phase: string[];
                                            access: string[];
                                            sop: string[];
                                          }) {
  const res = await post('/api/update-template', data);
  return res;
}

export async function autoCreate(data: { issueNum: string; manager: string; jobTitle: string; jiraSummary: string; allTask: string[]; user: string }) {
  const res = await post('/api/auto-create', data);
  return res;
}

export async function getPrecent(data: { issueNum: string }) {
  const res = await post('/api/get-percent', data);
  return res;
}

export async function getCompletedJiraTicket(data: { jiraSummary: string; issueNum: string }) {
  const res = await post('/api/get-completed-jira-ticket', data);
  return res;
}

export async function getTicketInfo(data: { preferredName: string; company: string; manager: string; jobTitle: string}) {
  const res = await post('/api/get-ticket-info', data);
  return res;
}

export async function getListExtra(data: { preferredName: string; company: string }) {
  const res = await post('/api/list-extra', data);
  return res;
}

export async function syncTemplate(data: { jobTitle: string; manager: string; sop: string[]; access: string[] }) {
  const res = await post('/api/sync-template', data);
  return res;
}

export async function getIssueStatus(data: { issueNumList: string[] }) {
  const res = await post('/api/issue-status', data);
  return res;
}

export async function getCloseTicket(data: { issueNum: string }) {
  const res = await post('/api/close-ticket', data);
  return res;
}

export async function getEncryptInfo(data: { encryptInfo: string }) {
  const res = await post('/api/encrypt-info', data);
  return res;
}

export async function getConfluence(data: { jiraSummary: string }) {
  const res = await post('/api/get-confluence', data);
  return res;
}

export async function getAllEmployee() {
  const res = await get('/api/list-all-employee');
  return res;
}

export async function generalDaiAccount(data: {
  jobTitle: string;
  company: string;
  jiraSummary: string;
  office: string;
  department: string;
  manager: string;
  issueNum: string;
  dai_or_ods: string[];
  ticketNum: string[];}) {
  const res = await post('/api/dai-account', data);
  return res;
}
