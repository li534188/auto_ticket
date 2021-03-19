const jiraInfo = {
  cronData: {
    pickerData: {
      timeType: 'Week',
      monthType: 'dayMonth',
      rate: 1,
      dayHowWeek: '1nd Week',
      inputTime: '13:00',
      inputDay: '',
      inputWeek: '',
      inputMonth: '',
      inputYear: '2020-02-02'
    },
    switchModel: true,
    pickerCron: '0 0 0 1 3 ? *',
    expressionCron: '0 0 0 1 3 ? *'
  },
  baseData: {
    company: 'DAI - Data Analysis, Inc.',
    name: 'test',
    time: '',
    groupValue: 'US Checklists',
    subGroupValue: 'subA',
    startTime: '2021-03-19',
    endTime: '2021-03-20'
  },
  jobDetail: '<p>Content of the editor.test</p>'
};

export default {
  'post|/parameter/list-all-employee': option => {
    console.log(option);
    return {
      status: 200,
      message: 'success',
      data: jiraInfo
    };
  }
};
