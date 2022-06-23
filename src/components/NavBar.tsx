/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Order',
    children: [
      {
        label: 'Outbound',
        subLabel: '',
        href: '/wms/order/outbound',
      },
    ],
  },
  {
    label: 'Item',
    children: [
      {
        label: 'Inbound',
        subLabel: '',
        href: '/wms/item/inbound',
      },
      {
        label: 'Outbound',
        subLabel: '',
        href: '/wms/item/outbound',
      },
    ],
  },
];

function DesktopSubNav({ label, href, subLabel }: NavItem) {
  return (
    <NextLink href={href ?? '#'}>
      <Link
        href={href}
        role='group'
        display='block'
        p={2}
        rounded='md'
        _hover={{ bg: useColorModeValue('gray.50', 'gray.900') }}
      >
        <Stack direction='row' align='center'>
          <Box>
            <Text
              transition='all .3s ease'
              _groupHover={{ color: 'gray.400' }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize='sm'>{subLabel}</Text>
          </Box>
          <Flex
            transition='all .3s ease'
            transform='translateX(-10px)'
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify='flex-end'
            align='center'
            flex={1}
          >
            <Icon color='gray.400' w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    </NextLink>
  );
}

function DesktopNav({ items }: { items: NavItem[] | null }) {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction='row' spacing={4}>
      {items
        ? items.map((navItem) => (
            <Box key={navItem.label}>
              <Popover trigger='hover' placement='bottom-start'>
                <PopoverTrigger>
                  <Box
                    p={2}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: 'none',
                      color: linkHoverColor,
                    }}
                  >
                    <NextLink href={navItem.href ?? '#'}>
                      {navItem.label}
                    </NextLink>
                  </Box>
                </PopoverTrigger>

                {navItem.children && (
                  <PopoverContent
                    border={0}
                    boxShadow='xl'
                    bg={popoverContentBgColor}
                    p={4}
                    rounded='xl'
                    minW='sm'
                  >
                    <Stack>
                      {navItem.children.map((child) => (
                        <DesktopSubNav key={child.label} {...child} />
                      ))}
                    </Stack>
                  </PopoverContent>
                )}
              </Popover>
            </Box>
          ))
        : null}
    </Stack>
  );
}

function MobileNavItem({ label, children, href }: NavItem) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify='space-between'
        align='center'
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition='all .25s ease-in-out'
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle='solid'
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align='start'
        >
          {children &&
            children.map((child) => (
              <NextLink href={child.href!} key={child.label}>
                <Box py={2}>{child.label}</Box>
              </NextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

function MobileNav({ items }: { items: NavItem[] | null }) {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {items
        ? items.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} />
          ))
        : null}
    </Stack>
  );
}

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();

  const { userData, signOut } = useContext(AuthContext);

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH='60px'
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle='solid'
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align='center'
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant='ghost'
            aria-label='Toggle Navigation'
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Box>
            <NextLink href='/'>
              <Link
                href='/'
                role='group'
                display='block'
                p={2}
                rounded='md'
                _hover={{ bg: useColorModeValue('gray.50', 'gray.900') }}
              >
                {/* <Image src='/assets/logo.png' width={122} height={29} /> */}
              </Link>
            </NextLink>
          </Box>

          <Flex display={{ base: 'none', md: 'flex' }} mt={3} ml={10}>
            <DesktopNav items={NAV_ITEMS} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify='flex-end'
          direction='row'
          spacing={6}
        >
          <Menu>
            <MenuButton
              as={Button}
              rounded='full'
              variant='link'
              cursor='pointer'
              minW={0}
            >
              Usuário: {userData?.username}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={signOut}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav items={NAV_ITEMS} />
      </Collapse>
    </Box>
  );
}
