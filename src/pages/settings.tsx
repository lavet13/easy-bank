import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
    ButtonGroup,
  Center,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Input,
  Tooltip,
  useColorModeValue,
  useEditableControls,
} from '@chakra-ui/react';
import { FC } from 'react';

const Settings: FC = () => {
  return (
    <Center flex='1'>
      <Container maxW={'600px'} flex='1'>
        <Editable
          defaultValue='Rasengan ⚡️'
          isPreviewFocusable={true}
          selectAllOnFocus={false}
        >
          <Tooltip label='Нажмите чтобы изменить' shouldWrapChildren={true}>
            <EditablePreview
              py={2}
              px={4}
              _hover={{
                background: useColorModeValue('gray.100', 'gray.700'),
              }}
            />
          </Tooltip>
          <Input py={2} px={4} as={EditableInput} />
          <EditableControls />
        </Editable>
      </Container>
    </Center>
  );
};

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  console.log({ submitProps: getSubmitButtonProps() });

  return isEditing ? (
    <ButtonGroup justifyContent='end' size='sm' w='full' spacing={2} mt={2}>
      <IconButton
        aria-label={'submit'}
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label={'cancel'}
        icon={<CloseIcon boxSize={3} />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : null;
}
export default Settings;
