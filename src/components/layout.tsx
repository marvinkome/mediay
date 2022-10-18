import { chakra, Stack, Menu, Divider, Text } from '@chakra-ui/react'
import { Box } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Layout = ({ title, bgColor, children }: any) => {
  return (
    <>
      <chakra.nav
        display={{ base: 'block', md: 'none' }}
        pos="fixed"
        top="0"
        right="0"
        left="0"
        zIndex="4"
      >
        <Stack w="100%" align="flex-end" px="5px" py="5px">
          <Menu />
        </Stack>
      </chakra.nav>

      <chakra.main bgColor={bgColor} pb="4rem">
        {children}
      </chakra.main>

      <chakra.nav pos="fixed" bottom="0" right="0" left="0" zIndex="2">
        <Text
          textTransform="uppercase"
          opacity="68%"
          fontSize={{ base: '10px', md: '13px' }}
          fontWeight="400"
          letterSpacing="0.08em"
          flex="1"
          whiteSpace="nowrap"
          display={{ base: 'none', md: 'flex' }}
        >
          © {new Date().getFullYear()} Solar System Studio.
        </Text>
      </chakra.nav>
    </>
  )
}

export default Layout
