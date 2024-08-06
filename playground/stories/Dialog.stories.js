import CpisModal from '../../packages/cupubase/src/components/model/Model.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Example/Modal',
  component: CpisModal,
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CpisModal },
    template: '<cpis-modal  v-bind="$props" />',
  }),
  argTypes: {
    visible: { control: 'boolean' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    visible: true,
  },
};
