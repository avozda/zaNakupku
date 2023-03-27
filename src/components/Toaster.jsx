import {
  Button,
  useToast,
  VStack,
  HStack,
  Text,
  Center,
  IconButton,
  CloseIcon,
  Alert,
  NativeBaseProvider,
  Pressable,
} from 'native-base';
import React from 'react';
import {connect} from 'react-redux';
import {Platform} from 'react-native';

const Toaster = ({alerts}) => {
  const toast = useToast();

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => (
    <Alert
      mr={Platform.OS == 'web' ? 10 : 0}
      maxWidth={Platform.OS == 'web' ? '100%' : '90%'}
      alignSelf="center"
      flexDirection="row"
      status={status ? status : 'info'}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === 'solid'
                  ? 'lightText'
                  : variant !== 'outline'
                  ? 'darkText'
                  : null
              }
            >
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <Pressable p={2} pt={2.5} onPress={() => toast.close(id)}>
              <CloseIcon size="3" />
            </Pressable>
          ) : null}
        </HStack>
        <Text
          px="6"
          color={
            variant === 'solid'
              ? 'lightText'
              : variant !== 'outline'
              ? 'darkText'
              : null
          }
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  );
  React.useEffect(() => {
    alerts.map(alert => {
      toast.show({
        render: ({id}) => {
          if (toast.isActive(id)) {
            return;
          }
          return (
            <ToastAlert
              id={id}
              status={alert.alertType}
              title={alert.msg}
              isClosable
            />
          );
        },
        placement: Platform.OS == 'web' ? 'bottom-right' : 'bottom',
      });
    });
  }, [alerts]);

  return <></>;
};

const mapStateToProps = state => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Toaster);
